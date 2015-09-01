#encoding:utf-8
import json
import os
import sys
from datetime import datetime
from django import http
from django.core.serializers.python import Serializer
from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render_to_response, RequestContext, get_object_or_404, render
from principal.models import Estados

############################################
####    Consultar Estados               ####   
############################################
@csrf_exempt
def consultar_estados(request):
	lista = Estados.objects.all().order_by('id')
	cantidad_estados = Estados.objects.all().order_by('id').count()
	id_estado = []
	estado = []
	for bus in lista:
		id_estado.append(bus.id)
		estado.append(bus.nombre_estado)

	variable = { 'id_estado':id_estado, 'estado':estado,'cantidad_estados':cantidad_estados }
	return HttpResponse(json.dumps(variable), content_type = 'application/json;charset=utf8')