//大纲生成函数
function outline_generate(form){
  var doc = DocumentApp.getActiveDocument();
  description = form.description;
  title = form.title;
  var data = {
    'title': title,
    "description": description,
    "id":PropertiesService.getScriptProperties().getProperty('id'),
    'token': 'fdsaghoawhglejfkldashf123lk12h@'
  };
  var options = {
    'method': 'POST',
    'contentType': 'text/plain',
    'payload' : JSON.stringify(data)
  };
  var response = UrlFetchApp.fetch('http://36.103.203.43:8010/outline/write',options);
  text = Utilities.jsonParse(response);
  if(text.status == "success"){
    //显示修改板块
    // var html = HtmlService.createTemplateFromFile('Demo.html').evaluate();
    // var div = html.querySelector('#panel');
    // div.style.display = "block";
    title = text.title;
    var para = doc.getBody().appendParagraph(title).setFontSize(20);
    para.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    doc.getBody().appendParagraph('\n');
    abstract = text.abstract;
    doc.getBody().appendParagraph(abstract).setFontSize(12);
    doc.getBody().appendParagraph('\n');
    for(i in text.outline){
      var num = parseInt(i) + 1
      var str = num.toString();
      doc.getBody().appendParagraph(str + ' ' + text.outline[i].section).setFontSize(15);
      outline += (str + text.outline[i].section + "\\n");
      recursion_json(text.outline[i], doc, i);
    }
    PropertiesService.getScriptProperties().setProperties(
      {
        'title':title.toString(),
        'abstract':abstract.toString(),
        'outline':outline.toString(),
      }
    );
    Outline_generation_SuccessDialog();
    return 1;
  }else{
    // var ui = DocumentApp.getUi();
    // var message = "Unable to find the paragraph";
    // ui.alert("失败", message, ui.ButtonSet.OK);
    Outline_generation_FailDialog();
    return 2;
  }
  doc.saveAndClose();
}

//递归解析json返回文件（outline_generate里面调用）
function recursion_json(a, doc, i){
  for(k in a.sub){
    var num1 = parseInt(i) + 1;
    var num2 = parseInt(k) + 1;
    var str = num1.toString()+ "." + num2.toString();
    doc.getBody().appendParagraph(str + ' ' + a.sub[k].section).setFontSize(15);
    outline += (str + a.sub[k].section + "\\n");
    if(a.sub[k].sub[0] != {}){
      recursion_json(a.sub[k]);
    }
  }
}