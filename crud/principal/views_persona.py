import json
import os
import sys
from datetime import datetime
from django import http
from django.core.serializers.python import Serializer
from django.http import HttpResponse, HttpResponseRedirect
from  django.views.decorators.csrf  import  csrf_exempt
from django.shortcuts import render_to_response, RequestContext, get_object_or_404, render 
from principal.models import Personas,Estados,TiposPersonas,TiposXPersonas
from principal.forms import PersonaForm

######################################
###         Inicio                 ### 
######################################
def inicio(request):
	formulario = PersonaForm()
	lista_tipos = TiposPersonas.objects.all().order_by('nombre_tipo')
	cantipos = TiposPersonas.objects.count()
	context = {'formulario':formulario,'lista_tipos':lista_tipos,'cantipos':cantipos}
	return render_to_response('personas.html',context, context_instance=RequestContext(request))

######################################
###    Registro de personas	       ###
######################################
def registrar_persona(request):
	if request.method == 'POST':
		cantipos = request.POST["cantipos"]
		nombre_us = request.POST["nombre_usuario"]
		cedula_us = request.POST["cedula_usuario"]
		estado_usuario = request.POST["estado_usuario"]
		fecha_usuario = request.POST["fecha_usuario"]
		fecha_usuario = datetime.strptime(fecha_usuario, '%d-%m-%Y').strftime('%Y-%m-%d')
		valor = insertar_persona(nombre_us,cedula_us,estado_usuario,fecha_usuario,cantipos,request)
	return HttpResponse(json.dumps(str(valor)), content_type = 'application/json;charset=utf8')

def insertar_persona(nombre_us,cedula_us,estado_usuario,fecha_usuario,cantipos,request):
	estadou = Estados.objects.get(id=estado_usuario)
	if nombre_us!='' and cedula_us!='':
	    recordset = Personas.objects.filter(cedula=cedula_us);
	    if recordset.exists():
	    	return 2
	    else:
	    	salvar_info = Personas(cedula = cedula_us, nombre = nombre_us, id_estado=estadou,fecha=fecha_usuario)
	    	salvar_info.save()
	    	for i in range(1,int(cantipos)): 
	    		if 'tipo'+str(i) in request.POST:	
	    			id_tipo = request.POST['tipo'+str(i)]
	    			if(id_tipo != ''):
	    				persona = Personas.objects.get(cedula=cedula_us)
	    				tipo = TiposPersonas.objects.get(id=id_tipo)
	    				personas_x_tipo = TiposXPersonas(id_persona=persona,id_tipo=tipo)
	    				personas_x_tipo.save()
	    return 1	
	else:
		return 0

@csrf_exempt
def registrar_imagen(request):
	if request.method == 'POST':
		cedula_us = request.POST["cedula_usuario"]
		if 'foto_usuario' in request.FILES:
			foto = request.FILES['foto_usuario']
			variable = ingresar_foto(foto, cedula_us)
		else:
			variable = '3'
	return HttpResponse(json.dumps(str(variable)), content_type = 'application/json;charset=utf8')

def ingresar_foto(foto, cedula):
	#try:
	fotos = str(foto)
	variable = ""
	cortar_foto = fotos.split('.')
	if cortar_foto[1] == "JPEG" or cortar_foto[1] == "jpg" or cortar_foto[1] == "jpeg" or cortar_foto[1] == "JPG":
		BASE_DIR = os.path.dirname(os.path.dirname(__file__))
		PROJECT_ROOT = os.path.dirname(os.path.realpath(__file__))
		RUTA_PROYECTO = os.path.dirname(os.path.realpath(__file__))
		MEDIA_ROOT = os.path.join(RUTA_PROYECTO,'../crud/static/images/fotos')
		nombre_foto = str(cedula)+".jpg"
		foto_pasar = open('%s/%s' % (MEDIA_ROOT, nombre_foto), 'wb')
		for chunk in foto.chunks():
			foto_pasar.write(chunk)
			pass
		foto_pasar.close()
		variable = update_imagen(nombre_foto,cedula)
	else:
		variable = '2'
	return variable;	
	pass
	#except Exception:
	#	return '0'

def update_imagen(foto,cedula):
	if cedula != "" and foto !="":
		Personas.objects.filter(cedula = cedula).update(foto = foto)
		variable = '1'
	else:
		variable = '4'
	return HttpResponse(json.dumps(str(variable)), content_type = 'application/json;charset=utf8')	

def cargar_persona(request):
	formulario = PersonaForm()
	lista_tipos = TiposPersonas.objects.all().order_by('nombre_tipo')
	cantipos = TiposPersonas.objects.count()
	context = {'formulario':formulario,'lista_tipos':lista_tipos,'cantipos':cantipos}
	return render_to_response('personas.html',context, context_instance=RequestContext(request))


######################################
###      Consultar Personas        ###
######################################

def consultar_personas(request):
	cont = 0
	cont2 = 0
	cantipos = TiposPersonas.objects.count()
	lista = TiposXPersonas.objects.all().distinct()
	tipos = []
	for bus in lista:
		lista_tipos = TiposXPersonas.objects.filter(id_persona=bus.id_persona.id)
		for bus2 in lista_tipos:
			cont+=1
			if cont == 1:
				tipo_str = bus2.id_tipo.nombre_tipo
			else:
				tipo_str = tipo_str+","+bus2.id_tipo.nombre_tipo
		tipos.append(tipo_str)		
		cont2+=1  	
		tipo_str = ""
		cont = 0

	cantidad = Personas.objects.all().order_by('nombre').select_related("TiposPersonas").count()
	context = { 'lista':lista,'cantipos':cantipos, 'cantidad':cantidad, 'tipos':tipos}
	return render_to_response('lista_personas.html', context, context_instance=RequestContext(request))

########################################
###			Consultar Personas JS	####
########################################

def consultar_personas2(request):
	context = {}
	return render_to_response('lista_personas2.html', context, context_instance=RequestContext(request))

@csrf_exempt
def consultar_personasjq(request):

	#lista = TiposXPersonas.objects.all().distinct()
	lista = Personas.objects.all().order_by('cedula').annotate()
	cuantos_tipos = Personas.objects.all().count()
	nombres = []
	cedula = []
	fechas = []
	estado = []
	tipos = []
	cont2 = 0
	for bus in lista:
		lista_tipos =  TiposXPersonas.objects.filter(id_persona=bus.id)
		#-- Creando las listas de tipos
		for bus2 in lista_tipos:
			cont2+=1
			if cont2 == 1:
				tipo_str = bus2.id_tipo.nombre_tipo
			else:
				tipo_str = tipo_str+","+bus2.id_tipo.nombre_tipo
				cont2 = 0	
		#--Creando las listas de personas
		fecha = bus.fecha
		nombres.append(bus.nombre)
		cedula.append(bus.cedula)
		fechas.append(fecha.isoformat())
		estado.append(bus.id_estado.nombre_estado)
		tipos.append(tipo_str)
		tipo_str = ""
		#--
	variable = {'cedula':cedula,'nombres':nombres,'fechas':fechas, 'estado':estado, 'tipos':tipos, 'cuantos_tipos':cuantos_tipos};	
	return HttpResponse(json.dumps(variable), content_type = 'application/json;charset=utf8')