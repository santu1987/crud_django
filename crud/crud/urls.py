#encoding:utf-8
from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
url(r'^$','principal.views_persona.inicio'),
url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
url(r'^admin/', include(admin.site.urls)),

#####################################
##        Personas				   ##
#####################################

url(r'^registrar/persona$','principal.views_persona.registrar_persona', name = "registrar persona"),
url(r'^registrar/imagen$','principal.views_persona.registrar_imagen', name = "registrar imagen"),
url(r'^consultar/personas$','principal.views_persona.consultar_personas',name="consultar persona"),
url(r'^consultar/personas2$','principal.views_persona.consultar_personas2', name="consultar personas jq vista"),
url(r'^consultar/personas_jq$','principal.views_persona.consultar_personasjq', name="conmsultar personas jq"),
url(r'^cargar/persona$','principal.views_persona.inicio', name= "cargar persona"),
url(r'^consultar/personas_pag$','principal.views_persona.consultar_personas_pag', name = "consultar persona pager")
)