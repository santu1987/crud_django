//--Bloque de Eventos
$(document).ready(function(){
	//alert("Here Motherfuckers");
	ir_tabla(0,0,10,0);
//--
	$("#actualizar_usuario").on("click",function(){
		/*var nombre_us = $("#nombre_us").val();
		var cedula_us = $("#cedula_us").val();
		var fecha = $("#fecha").val();
		var estado_usuario = $("#estado_usuario").val();
		var data = {
			'nombre_us' : nombre_us,
			'cedula_us' : cedula_us,
			'fecha': fecha,
			'estado_usuario':estado_usuario
		};*/
		var formulario = new FormData($("#form_act_us")[0]);
		$.ajax({
					url :"/modificar/personas",
					type:"POST",
					data:formulario,
					cache : false,
					contentType: false,
    				processData: false,
					error:function(resp){
						console.log(resp);
					},
					success: function(data){
						if(data==1){
							mensaje_afirmativo("#respuesta2","Actualizaci&oacute;n realizada con &eacute;xito");
							cerrar_mensaje();
							reset_tabla();
						}
						if(data==2){
							mensaje_validacion("#respuesta2","No se encuentra registrada la persona");
						}
					}
		});
	});
});
//--Bloque de Funciones

function consultar_filtro(){
	ir_tabla(0,0,20,0);
}

function ir_tabla(actual,cuantos_son,cuantos_x_pagina,tipo){
	var csrfmiddlewaretoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
	//--Sección de Filtros:
	var filtro_name = $("#filtro_name").val();
	var filtro_id = $("#filtro_id").val();
	var filtro_ci = $("#filtro_ci").val();
	//--
	var data = {
					'actual' : actual,
					'cuantos_son' : cuantos_son,
					'cuantos_x_pagina' : cuantos_x_pagina,
					'tipo' : tipo,
					'filtro_name' : filtro_name,
					'filtro_ci' : filtro_ci,
					'csrfmiddlewaretoken':csrfmiddlewaretoken
				}
	$.ajax({
				url:"/consultar/personas_jq",
				type:"POST",
				data:data,
				cache: false,
				error:function(resp){
					console.log(resp);
					//debe ir mensaje de alerta
				},
				success:function(html){
					var cabecera_tabla="<table class='table table-striped table-hover' id='tabla_consulta'>\
											<thead>\
												<th>N#</th>\
												<th>Nombres</th>\
												<th>Cédula</th>\
												<th>Fecha</th>\
												<th>Estado</th>\
												<th>Profesion</th>\
											</thead>\
											<tbody>";
					var arr = new Array();
					//alert(html["fechas"][1]);
					for(i=0;i<20;i++)
					{
						if(html["nombres"][i])
						{
							cabecera_tabla+="<tr id='us"+i+"' onclick='cargar_modal("+i+");' data='"+html["nombres"][i]+"*"+html["cedula"][i]+"*"+html["fechas"][i]+"*"+html["estado"][i]+"*"+html["tipos"][i]+"*"+html["id_estado"][i]+"*"+html["id_tipo"][i]+"'>\
											<td>"+i+"</td>\
											<td>"+html["nombres"][i]+"</td>\
											<td>"+html["cedula"][i]+"</td>\
											<td>"+html["fechas"][i]+"</td>\
											<td>"+html["estado"][i]+"</td>\
											<td>"+html["tipos"][i]+"</td>\
										</tr>";	
						}							
					}
					cabecera_tabla+="</tbody></table>";
					$("#tabla_consulta_cuadro").html(cabecera_tabla);
					$("#tabla_consulta_cuadro").html(cabecera_tabla);
					//alert(html["paginador"]['tipo']+"-"+html["paginador"][9]);
					//alert(html["paginador"]["clase_paginador_anterior"]);
					var pager = '<button type="button" class="btn btn-primary pag_btn '+html["paginador"]["clase_paginador_anterior"]+'" onclick="ir_tabla('+html["paginador"]["offset_tabla"]+','+html["paginador"]['cuantos_tabla']+',20,2);" title="Ir anterior"><i class="fa fa-chevron-left"></i></button>\
					<button type="button" class="btn btn-primary pag_btn '+html["paginador"]["clase_paginador_siguiente"]+'" onclick="ir_tabla('+html["paginador"]["offset_tabla"]+','+html["paginador"]["cuantos_tabla"]+',20,1)" title="Ir siguiente"><i class="fa fa-chevron-right"></i></button>\
					<span class="hide" id="offset_tabla" name="offset_tabla">"'+html["paginador"]["offset_tabla"]+'"</span>\
					<span class="span_paginacion" id="inicio_tabla" name="inicio_tabla">'+html["paginador"]["inicio_tabla"]+'</span><span class="span_paginacion">-</span>\
					<span class="span_paginacion" id="fin_tabla" name="fin_tabla">'+html["paginador"]["fin_tabla"]+'</span><span> de </span><span class="span_paginacion">:</span>\
					<span class="span_paginacion" id="cuantos_tabla" name="cuantos_tabla">'+html["paginador"]["cuantos_tabla"]+'</span>';
					$("#pager").html(pager);
			}	
	});
}

function cargar_modal(i){
	if($("#us"+i).on("click")){
		var data = $("#us"+i).attr("data");
		var arreglo_datos = data.split("*");
		//--Armando el modal
		var cuerpo_mensaje ="<div class='contenido_modal'>\
								<form id='form_act_us' name='form_act_us' class='form-horizontal'>\
									<div class='form-group'>\
										<div class='col-lg-12'>\
											<input type='text' name='nombre_us' id='nombre_us' class='form-control' placeholder='Ingrese nombre de usuario' value='"+arreglo_datos[0]+"'>\
										</div>\
									</div>\
									<div class='form-group'>\
										<div class='col-lg-12'>\
											<input type='text' name='cedula_us' id='cedula_us' class='form-control' placeholder='Ingrese c&eacute;dula usuario' value='"+arreglo_datos[1]+"'>\
										</div>\
									</div>\
									<div class='form-group'>\
										<div class='col-lg-12'>\
											<input type='text' name='fecha' id='fecha' class='form-control' placeholder='dd/mm/aaaa' onkeyup='this.value=formateafecha(this.value);' value='"+arreglo_datos[2]+"'>\
										</div>\
									</div>\
										<select class='form-control chosen' id='estado_usuario' name='estado_usuario'></select>\
									<div class='form-group'>\
										<div class='col-lg-12'>\
										</div>\
									</div>\
									<div id='respuesta2'></div>\
								</form>\
							</div>";
		mensajes(cuerpo_mensaje);
		$("#cabecera_mensaje").html("<h3 class='modal-title' id='myModalLabel' name='myModalLabel'>Actualizar datos de usuarios</h3>");
		//--Configurando el modal
		$("#aceptar_mensaje").css({"display":"none"});
		//-------------------------
		//cargar_estados();			
		//alert(arreglo_datos[5]);
		cargar_estados(arreglo_datos[5]);
		$("#estado_usuario").val(arreglo_datos[5]);
		$('#estado_usuario').prepend(new Option('SELECCIONE...', '0', true, true));	
		$('#estado_usuario').trigger("chosen:updated");
		/*$('.chosen').chosen({
	    	no_results_text: "No hemos encontrado resultados!",
			allow_single_deselect: true
		});*/
		$("#fecha").datetimepicker({ 
		    lang:'es',
		    minDate:0,
		    timepicker:false,
		    format:'d-m-Y',
		    formatDate:'Y-m-d'
		});
		//--------------------------	

	}
}

function cargar_estados(seleccionado){
	var data = '';
	var selected = '';
	$.ajax({
				url:"/consultar/estados",
				type:"POST",
				data:data,
				cache:false,
				error:function(resp){
					console.log(resp);
				},
				success:function(data){
					var opcion_select = "";
					for(i=0;i<data["cantidad_estados"];i++){
						x = i+1;
						//alert("*seleccionado:"+seleccionado+" "+"*x:"+x)
						if (seleccionado==x){
							selected = "selected";
						}else{
							selected = "";
						}
						opcion_select+= "<option value='"+data["id_estado"][i]+"' "+selected+">"+data["estado"][i]+"</option>";
					}
					$("#estado_usuario").append(opcion_select);
				}
	});
}

function reset_tabla(){
	var cuantos_tabla = $("#cuantos_tabla").text();
	var inicio_tabla = $("#inicio_tabla").text();
	var ini = parseInt(inicio_tabla)-21;
	ir_tabla(ini, cuantos_tabla,20,1);
}
//--