//--Bloque de Eventos
$(document).ready(function(){
	//alert("Here Motherfuckers");
	data = '';
	$.ajax({
				url:"/consultar/personas_jq",
				type:"POST",
				data:data,
				cache: false,
				contentType: "application/json",
   				processData: false,
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
					//alert(html["cuantos_tipos"])
					for(i=0;i<html["cuantos_tipos"];i++)
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
					cabecera_tabla+="</tbody></table>";
					$("#tabla_consulta_cuadro").html(cabecera_tabla);

				}	
	});
//--
});
