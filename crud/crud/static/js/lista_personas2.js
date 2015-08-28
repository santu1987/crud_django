//--Bloque de Eventos
$(document).ready(function(){
	//alert("Here Motherfuckers");
	ir_tabla(0,0,10,0);
//--
});
//--Bloque de Funciones
function consultar_filtro(){
	alert("here motherfuckers....");
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
							cabecera_tabla+="<tr>\
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
//--