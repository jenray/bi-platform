define(["template"],function(a){function b(b){"use strict";b=b||{};var c=a.utils,d=(c.$helpers,b.tableId),e=c.$each,f=b.currDims,g=(b.$dim,b.$index,c.$escape),h=b.fields,i=(b.$level,b.$field,b.dateFormatOptions),j=(b.$format,"");return"0"===d||"ownertable"===d?(j+='\r\n<!--内置维度-->\r\n<div class="date-relation-owner-two-part c-f j-date-two-part">\r\n    <span>选择时间字段：</span>\r\n    <select>\r\n        <option value="0">请选择</option>\r\n        ',e(f,function(a){j+="\r\n        <option value=",j+=g(a.id),j+=">",j+=g(a.name),j+="\r\n        </option>\r\n        "}),j+='\r\n    </select>\r\n    <span>粒度：</span>\r\n    <select class="j-owner-date-level-select">\r\n        <option value="0">请选择</option>\r\n        ',e(h,function(a){j+="\r\n        <option value=",j+=g(a.id),j+=">",j+=g(a.name),j+="\r\n        </option>\r\n        "}),j+='\r\n    </select>\r\n    <span>时间格式：</span>\r\n    <select class="j-owner-date-type-select">\r\n        <option value="0">请选择</option>\r\n    </select>\r\n</div>\r\n'):(j+='\r\n<!--普通维度-->\r\n<div class="date-relation-normal-two-part c-f j-date-two-part">\r\n    <span>指定关联字段：</span>\r\n    <select>\r\n        <option value="0">请选择</option>\r\n        ',e(f,function(a){j+="\r\n        <option value=",j+=g(a.id),j+=">",j+=g(a.name),j+="\r\n        </option>\r\n        "}),j+='\r\n    </select>\r\n    <span class="equal">=</span>\r\n    <select>\r\n        <option value="0">请选择</option>\r\n        ',e(h,function(a){j+="\r\n        <option value=",j+=g(a.id),j+=">",j+=g(a.name),j+="\r\n        </option>\r\n        "}),j+='\r\n    </select>\r\n</div>\r\n<div class="date-relation-normal-three-part j-date-three-part">\r\n    <span class="date-relation-normal-three-part-name">日期格式：</span>\r\n    <div class="date-relation-normal-three-part-box c-f">\r\n        ',e(h,function(a){j+='\r\n        <div class="date-relation-normal-three-part-box-date-format c-f">\r\n            <span>',j+=g(a.name),j+="</span>\r\n            <select formatKey=",j+=g(a.id),j+='>\r\n                <option value="0">请选择</option>\r\n                ',e(i[a.id],function(a){j+="\r\n                <option value=",j+=g(a),j+=">",j+=g(a),j+="\r\n                </option>\r\n                "}),j+="\r\n            </select>\r\n        </div>\r\n        "}),j+="\r\n    </div>\r\n</div>\r\n"),j+="\r\n\r\n\r\n"}return{render:b}});