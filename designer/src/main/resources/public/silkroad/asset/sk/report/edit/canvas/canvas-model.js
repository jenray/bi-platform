define(["url","constant","report/component-box/components/form-config"],function(a){var b="snpt.";return Backbone.Model.extend({initialize:function(a){this.parentModel=a.parentModel,this.compBoxModel=a.compBoxModel,window.canvas=this},initJson:function(c){var d=this;$.ajax({url:a.initJson(d.id),success:function(a){if(null!==a.data)d.reportJson=JSON.parse(a.data);else{d.reportJson=$.extend(!0,{},d.compBoxModel.config.defaultJson);var e=d.compBoxModel.config.formModel;d.reportJson.entityDefs.push(e.processRenderData(b))}c(d.reportJson)}})},initVm:function(c){var d=this;$.ajax({url:a.initVm(d.id),success:function(a){if(null!==a.data)d.$reportVm=$(a.data);else{d.$reportVm=$(d.compBoxModel.config.defaultVm);var e=d.compBoxModel.config.formModel;d.$reportVm.append(e.vmTemplate.render({id:b}))}c(d.$reportVm)}})},hasFormComponent:function(){for(var a=this.reportJson.entityDefs,b=0,c=a.length;c>b;b++){var d=a[b];if("DI_FORM"===d.clzKey)return!0}return!1},_getFormJson:function(){for(var a=this.reportJson.entityDefs,b=0,c=a.length;c>b;b++){var d=a[b];if("DI_FORM"===d.clzKey)return d}return null},addComp:function(b,c,d,e){var f=this;$.ajax({url:a.addComp(f.id),type:"POST",data:{type:c},success:function(a){var g=a.data;f.addCompDataToVm(d,b,c,g),f.addCompDataToJson(b,c,g),f.saveJsonVm(e)}})},addCompDataToVm:function(a,c,d,e){var f=b+e.id,g=a(e.id,f);g.html(c.vm.render({rootId:b,serverData:e})),this.$reportVm.append(g)},addCompDataToJson:function(a,c,d){for(var e,f=this.reportJson,g=!1,h=!1,i=f.entityDefs,j=0;j<i.length;j++)"COMPONENT"===i[j].clzType&&"DI_FORM"===i[j].clzType&&i[j].vuiRef&&i[j].vuiRef.confirm&&(h=!0);if(e=a.processRenderData({rootId:b,serverData:d}),h&&e.dataOpt&&(e.dataOpt.submitMode="CONFIRM"),$.isArray(e))for(var j=0,k=e.length;k>j;j++)e[j].compId=d.id;else e.compId=d.id;if(a.entityDescription&&!$.isArray(a.entityDescription)&&"VUI"==a.entityDescription.clzType&&(formJson=this._getFormJson(),"H_BUTTON"===a.entityDescription.clzKey?(formJson.vuiRef.confirm=e.id,g=!0):formJson.vuiRef.input.push(e.id)),g)for(var j=0;j<i.length;j++)"COMPONENT"===i[j].clzType&&i[j].dataOpt&&i[j].dataOpt.submitMode&&(i[j].dataOpt.submitMode="CONFIRM");this.reportJson.entityDefs=i.concat(e)},deleteComp:function(b,c,d){var e=this;$.ajax({url:a.deleteComp(e.id,b),type:"DELETE",success:function(){e._deleteComp(b,c,d)}})},_deleteComp:function(a,b,c){var d=this,e=!1,f=!1;c=c||new Function;var g="[data-comp-id="+a+"]";d.$reportVm.find(g).remove();for(var h=d.reportJson.entityDefs,i=0;i<h.length;i++){if(h[i].compId==a){if("VUI"!=h[i].clzType||"X_CALENDAR"!==h[i].clzKey&&"RANGE_CALENDAR"!==h[i].clzKey&&"ECUI_SELECT"!==h[i].clzKey&&"ECUI_MULTI_SELECT"!==h[i].clzKey&&"ECUI_INPUT_TREE"!==h[i].clzKey||(d._deleteCompFromForm(h[i].id),e=!0),"VUI"==h[i].clzType&&"H_BUTTON"===h[i].clzKey&&h[i].dataOpt&&"查询"===h[i].dataOpt.text){var j=d._getFormJson();j.vuiRef.confirm=null,delete j.vuiRef.confirm,e=!0,f=!0}h.splice(i,1),i--}if("COMPONENT"===h[i].clzType&&h[i].interactions)for(var k=0,l=h[i].interactions.length;l>k;k++){var m=h[i].interactions[k];if(m.event&&m.event.rid===b)h[i].interactions.splice(k,1);else if(m.events)for(var n=0,o=m.events.length;o>n;n++)m.events[n].rid===b&&m.events.splice(n,1)}}if(f)for(var i=0;i<h.length;i++)"COMPONENT"===h[i].clzType&&h[i].dataOpt&&h[i].dataOpt.submitMode&&(h[i].dataOpt.submitMode="IMMEDIATE");d.saveJsonVm(c)},_processFrom:function(){var a=this._getFormJson(),b=a.vuiRef.input;0==b.length&&this._deleteComp("comp-id-form"),this._responseFormChange()},_deleteCompFromForm:function(a){for(var b=this._getFormJson(),c=b.vuiRef.input,d=0,e=c.length;e>d;d++)if(c[d]==a){c.splice(d,1);break}},updateCompPositing:function(a,b,c){this.$reportVm.find("[data-comp-id="+a+"]").css({left:b,top:c}),this.saveJsonVm()},dateCompPositing:function(a,b){var c=this.$reportVm.find("[id="+a+"]");c.attr("id")==a&&c.html(b),this.saveJsonVm()},resizeComp:function(a){this.$reportVm.find("[data-comp-id="+a.compId+"]").css({width:a.width,height:a.height}).find(".vu-table").height(parseInt(a.height)-89),this.saveJsonVm()},saveReport:function(b,c,d){var e=this;$.ajax({url:a.saveReport(e.id),type:"PUT",data:{json:JSON.stringify(e.reportJson),vm:e.$reportVm.prop("outerHTML")},success:function(a){if(0===a.status)c&&c();else{var e=a.statusInfo;d&&d(e,b)}}})},saveJsonVm:function(b){var c=this;b=b||new Function,$.ajax({url:a.saveJsonVm(c.id),type:"PUT",data:{json:JSON.stringify(c.reportJson),vm:c.$reportVm.prop("outerHTML")},success:function(){b()}})},saveEditReportName:function(b,c){$.ajax({type:"POST",dataType:"json",cache:!1,timeout:1e4,uri:a.saveEditReportName(b,c),success:function(a){0===a.status?dialog.success(a.statusInfo):dialog.error(a.statusInfo)}})}})});