define(["template","dialog","report/edit/canvas/canvas-model","report/report-view","report/component-box/main-view","report/edit/canvas/edit-comp-view","report/edit/canvas/edit-btns-template","report/edit/canvas/guides-template"],function(a,b,c,d,e,f,g,h){return Backbone.View.extend({events:{"click .j-con-edit-btns .j-setting":"initCompConfigBar","click .j-con-edit-btns .j-delete":"deleteComp","click .j-button-save-report":"saveReport","click .j-button-close-report":"closeReport","click .j-button-publish-report":"publishReport","click .j-button-preview-report":"previewReport","click .j-comp-div":"focusText","blur .j-comp-text":"blurText","keydown .j-comp-text":"keyDownText"},savestate:0,initialize:function(a){var b=this;b.compBoxView=new e({el:b.el,id:b.id,canvasView:b}),this.model=new c({id:b.id,parentModel:a.parentView.model,compBoxModel:b.compBoxView.model}),b.parentView=a.parentView,b.editCompView=new f({el:b.el,reportId:b.id,canvasView:b}),b.reportView=new d({id:b.id}),b.model.initJson(function(){b.model.initVm(function(){b.showReport()})})},initAcceptComp:function(){function a(a,b){for(var c=!1,d=0;d<b.length;d++)b[d].clzKey===a&&b[d].dataOpt&&"查询"===b[d].dataOpt.text&&(c=!0);return c}var b=this,c=b.compBoxView.model,d="active",e="disable",f=b.model.reportJson.entityDefs;$(".j-report",b.el).droppable({accept:".j-con-component-box .j-component-item",tolerance:"intersect",drop:function(d,e){var g=$(this),h=e.helper.attr("data-component-type");if("H_BUTTON"!==h||!a(h,f)){var i=e.helper.clone().html('<div class="ta-c">组件占位，配置数据后展示组件</div>'),j=c.getComponentData(h);i.removeClass(j.iconClass+" active"),i.addClass(j.renderClass),i.css({cursor:"auto"}),g.removeClass("active");var k=i.attr("data-default-width");i.css({width:k+"px",height:i.attr("data-default-height")+"px"});var l=parseInt(i.css("left")),m=g.width();l/1+k/1>m&&i.css("left",m-k-3+"px"),parseInt(i.css("left"))<2&&i.css("left","3px"),parseInt(i.css("top"))<2&&i.css("top","3px"),b.addComp(j,h,i)}},helper:"clone",out:function(a,b){$(this).removeClass(d),b.helper.removeClass(d).addClass(e),b.helper.html('<div class="ta-c">已超出画布区</div>')},over:function(a,b){$(this).addClass(d),b.helper.removeClass(e).addClass(d),b.helper.html('<div class="ta-c">组件占位，配置数据后展示组件</div>')}})},focusText:function(a){var b="点击进行输入",c=$(a.target),d=c.parent(),e=c,f=d.next(),g=e.html();d.hide(),f.show().focus(),g!=b?f.val(e.html()):f.val("")},blurText:function(a){var b=$(a.target).val(),c=this;c.saveBtnsText(a,b)},keyDownText:function(a){var b=$(a.target).val(),c=this;13==a.keyCode&&c.saveBtnsText(a,b)},saveBtnsText:function(a,b){var c="点击进行输入",d=$(a.target),e=d.prev(),f=e.find("div"),g=f.attr("id");d.hide(),e.show(),""!=b?f.html(b):f.html(c),this.model.dateCompPositing(g,b)},addComp:function(a,b,c){var d=this;d.model.addComp(a,b,function(a,b){return c.attr("data-comp-id",a),c.attr("report-comp-id",b),c.clone()},function(){var a=c.attr("data-component-type");d.$el.find('[data-o_o-di="snpt"]').append(c),d.initDrag(c),d.initResize(c),d.addEditBtns(c),d.removeGuides(c),d.addGuides(c),c.find(".j-con-edit-btns").css({width:"auto",height:"auto"}),("TEXT"===a||"H_BUTTON"===a)&&d.showReport(!0)})},deleteComp:function(a){var b=this,c=$(a.target),d=c.parents(".j-component-item"),e=d.attr("data-comp-id"),f=d.attr("report-comp-id");this.model.deleteComp(e,f,function(){d.remove(),b.editCompView.hideEditBar(),b.showReport()})},initDrag:function(a){var b=this;a.draggable({helper:"original",scroll:!0,scrollSensitivity:100,containment:this.$el.find(".j-report"),opacity:.8,handle:".j-drag",start:function(a,b){b.helper.attr("data-sort-startScrrolTop",b.helper.parent().scrollTop())},stop:function(a,c){b.updateCompPositing(c.helper),b.initSnptHeight()}})},initResize:function(a){var b=this;a.resizable({stop:function(a,c){var d=c.size;d.compId=$(this).attr("data-comp-id"),b.model.resizeComp(d),b.showReport(!0)}}),a.find(".ui-resizable-e,.ui-resizable-s").remove(),a.filter('[data-component-type="TABLE"]').resizable("option","minHeight",204),b.dragWidthHeight(a,"SELECT",47,47),b.dragWidthHeight(a,"MULTISELECT",47,47),b.dragWidthHeight(a,"TEXT",50,50),b.dragWidthHeight(a,"H_BUTTON",55,55),b.removeGuides(a),b.addGuides(a)},dragWidthHeight:function(a,b,c,d){a.filter('[data-component-type="'+b+'"]').resizable("option","minHeight",c),a.filter('[data-component-type="'+b+'"]').resizable("option","maxHeight",d)},updateCompPositing:function(a){var b=a.attr("data-comp-id"),c=a.css("left"),d=a.css("top");this.model.updateCompPositing(b,c,d)},addGuides:function(a){a.append(h.render())},removeGuides:function(a){a.find(".j-guide-line").remove()},addEditBtns:function(a){a.prepend(g.render()),a.find(".comp-box").css("margin-top",0);for(var b=0;b<a.length;b++){var c=$(a[b]).attr("data-component-type");("TEXT"===c||"H_BUTTON"===c)&&$(a[b]).find(".j-setting").remove()}},saveReport:function(){this.model.saveReport(function(){b.success("报表保存成功。")}),this.savestate=1},closeReport:function(){0==this.savestate?b.warning("您未进行保存，请保存后关闭。"):(this._destroyPanel(),require(["report/list/main-view"],function(a){new a({el:$(".j-main")})}))},_destroyPanel:function(){window.dataInsight&&window.dataInsight.main&&window.dataInsight.main.destroy()},publishReport:function(){0==this.savestate?b.warning("您未进行保存，请保存后发布。"):this.reportView.publishReport("POST")},previewReport:function(){this.reportView.previewReport("POST")},initCompConfigBar:function(a){this.editCompView.initCompConfigBar(a)},initSnptHeight:function(){var a=this.$el.find('[data-o_o-di="snpt"]'),b=200,c=this.$el.find(".report .j-component-item"),d=0;c.each(function(){var a=$(this),b=a.height()+parseInt(a.css("top"));d=b>d?b:d}),a.height(d+b)},destroy:function(){this.model.clear({silent:!0}),this.stopListening(),this.$el.unbind().empty(),this._component&&this._component.dispose()},showReport:function(){var a=this;if(a.model.reportJson.entityDefs.length<2){var b=a.model.$reportVm.prop("outerHTML");return a.$el.find(".j-report").html(b),a.initAcceptComp(),void 0}var c={parentEl:a.$el.find(".j-report")[0],reportId:a.id,rptHtml:a.model.$reportVm.prop("outerHTML"),rptJson:a.model.reportJson};a._firstShowReport=!1,void 0===a._component?require(["report/component-combination/enter"],function(b){a._component=b,b.start(c)}):(a._component.dispose(),a._component.start(c)),window.setTimeout(function(){var b=a.$el.find(".j-report"),c=b.find(".j-component-item");a.initDrag(c),a.initResize(c),a.addEditBtns(c),a.initAcceptComp(),a.editCompView.activeComp(),a.initSnptHeight()},2e3)}})});