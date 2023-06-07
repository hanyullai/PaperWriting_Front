//全局变量，存储文章的信息
var title;
var abstract;
var outline = '';
var description;
var section_route;
var id = [];
var state;

function doGet(e){
  return HtmlService.createHtmlOutputFromFile("Assistant");
}

//文档打开时的初始化函数
function onOpen(){
  // DocumentApp.getActiveDocument().getBody().appendParagraph("123");
  DocumentApp.getUi().createMenu("Assistant")
  .addItem("Writing Assistant", "showDemoSidebar").addToUi();
  // DocumentApp.getActiveDocument().getBody().appendParagraph("456");
  PropertiesService.getScriptProperties().setProperties(
      {
        'id':JSON.stringify([]),
        'id_name':JSON.stringify([]),
      }
    );
  createNewTrigger();
}

//显示模板分页
function showDemoSidebar(){
  var widget = HtmlService.createTemplateFromFile("Assistant.html").evaluate();
  widget.setTitle("Writing Assistant");
  DocumentApp.getUi().showSidebar(widget);
}

//大纲修改函数
function outline_edit(form) {
  if(form.instruction.toString().trim() == ""){
    return "请输入有效文本";
  }
  var paragraphs = DocumentApp.getActiveDocument().getBody().getParagraphs(); 
  const selection = DocumentApp.getActiveDocument().getSelection();
  var explain = "";
  var msg = "";
  if (selection) {
    let replaced = false;
    const elements = selection.getRangeElements();
    let text = "";
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i].getElement();
      const elementType = element.getType();
      if (elementType === DocumentApp.ElementType.TEXT) {
        const start = elements[i].getStartOffset();
        const end = elements[i].getEndOffsetInclusive();
        text += element.asText().getText().substring(start, end + 1);
      } else if (elementType === DocumentApp.ElementType.PARAGRAPH) {
        const paragraph = element.asParagraph();
        text += paragraph.getText();
        text += '\n'
      }
    }
    var tmptitle = PropertiesService.getScriptProperties().getProperty("title");
    var tmpabstract =  PropertiesService.getScriptProperties().getProperty("abstract");
    var tmpoutline = PropertiesService.getScriptProperties().getProperty("outline");
    var tmpsection = PropertiesService.getScriptProperties().getProperty("section");
    if((tmptitle && tmptitle.includes(text)) &&
    !(tmpabstract && tmpabstract.includes(text)) &&
    !(tmpoutline && tmpoutline.includes(text)) && 
    !(tmpsection && tmpsection.includes(text))){
      var data = {
        'title': text.toString(),
        'instruction': form.instruction,
        'id' : PropertiesService.getScriptProperties().getProperty('id'),
        'token': 'fdsaghoawhglejfkldashf123lk12h@'
      };
      var options = {
        'method': 'POST',
        'contentType': 'text/plain',
        'payload' : JSON.stringify(data)
      };
      var response = UrlFetchApp.fetch('http://36.103.203.43:8010/outline/edit_title',options);
      text = Utilities.jsonParse(response);
      if(text.status == "success"){
        explain = text.explain;
        Edit_SuccessDialog(text.explain);
      }else{
        msg = text.msg;
        Edit_FailDialog(text.msg);
        return (msg?msg:"修改失败");
      }
      newText = text.title;
      PropertiesService.getScriptProperties().setProperties(
        {
        'title':newText,
        }
      )
      for (let i = 0; i < elements.length; ++i) {
        if (elements[i].isPartial()) {
          const element = elements[i].getElement().asText();
          const startIndex = elements[i].getStartOffset();
          const endIndex = elements[i].getEndOffsetInclusive();
          element.deleteText(startIndex, endIndex);
          if (!replaced) {
            element.insertText(startIndex, newText).setFontSize(20);
            replaced = true;
          } else {
            const parent = element.getParent();
            const remainingText = element.getText().substring(endIndex + 1);
            parent.getPreviousSibling().asText().appendText(remainingText);
            if (parent.getNextSibling()) {
              parent.removeFromParent();
            } else {
              element.removeFromParent();
            }
          }
        } else {
          const element = elements[i].getElement();
          if (!replaced && element.editAsText) {
            element.clear();
            element.asText().setText(newText).setFontSize(20);
            replaced = true;
          } else {
            if (element.getNextSibling()) {
              element.removeFromParent();
            } else {
              element.clear();
            }
          }
        }
      }
    } else if(!(tmptitle && tmptitle.includes(text)) &&
    (tmpabstract && tmpabstract.includes(text)) &&
    !(tmpoutline && tmpoutline.includes(text)) && 
    !(tmpsection && tmpsection.includes(text))){
      var mark_abstract = PropertiesService.getScriptProperties().getProperty("abstract").replace(text, "<待修改内容>" + text + "</待修改内容>");
      var data = {
        'title': PropertiesService.getScriptProperties().getProperty('title'),
        'abstract':mark_abstract,
        'instruction': form.instruction,
        'id': PropertiesService.getScriptProperties().getProperty('id'),
        'token': 'fdsaghoawhglejfkldashf123lk12h@'
      };
      var options = {
        'method': 'POST',
        'contentType': 'text/plain',
        'payload' : JSON.stringify(data)
      };
      var response = UrlFetchApp.fetch('http://36.103.203.43:8010/outline/edit_abstract',options);
      text = Utilities.jsonParse(response);
      if(text.status == "success"){
        explain = text.explain;
        Edit_SuccessDialog(text.explain);
      }else{
        msg = text.msg;
        Edit_FailDialog(text.msg);
        return (msg?msg:"修改失败");
      }
      newText = text.abstract;
      PropertiesService.getScriptProperties().setProperties(
        {
        'abstract':paragraphs[3].getText().toString(),
        }
      )
      for (let i = 0; i < elements.length; ++i) {
        if (elements[i].isPartial()) {
          const element = elements[i].getElement().asText();
          const startIndex = elements[i].getStartOffset();
          const endIndex = elements[i].getEndOffsetInclusive();
          element.deleteText(startIndex, endIndex);
          if (!replaced) {
            element.insertText(startIndex, newText).setFontSize(12);
            replaced = true;
          } else {
            const parent = element.getParent();
            const remainingText = element.getText().substring(endIndex + 1);
            parent.getPreviousSibling().asText().appendText(remainingText);
            if (parent.getNextSibling()) {
              parent.removeFromParent();
            } else {
              element.removeFromParent();
            }
          }
        } else {
          const element = elements[i].getElement();
          if (!replaced && element.editAsText) {
            element.clear();
            element.asText().setText(newText).setFontSize(12);
            replaced = true;
          } else {
            if (element.getNextSibling()) {
              element.removeFromParent();
            } else {
              element.clear();
            }
          }
        }
      }
    }else if(!(tmptitle && tmptitle.includes(text)) &&
    !(tmpabstract && tmpabstract.includes(text)) &&
    (tmpoutline && tmpoutline.includes(text)) && 
    !(tmpsection && tmpsection.includes(text))){
      if(selection.getRangeElements().length == 1){
        Reselect_Dialog();
        return "请重新选择修改部分";
      }
      var data = {
        'title': PropertiesService.getScriptProperties().getProperty('title'),
        'outline':text,
        'instruction': form.instruction,
        'id': PropertiesService.getScriptProperties().getProperty('id'),
        'token': 'fdsaghoawhglejfkldashf123lk12h@'
      };
      var options = {
        'method': 'POST',
        'contentType': 'text/plain',
        'payload' : JSON.stringify(data)
      };
      var response = UrlFetchApp.fetch('http://36.103.203.43:8010/outline/edit_outline',options);
      text = Utilities.jsonParse(response);
      if(text.status == "success"){
        state = "success";
        explain = text.explain;
        Edit_SuccessDialog(text.explain);
      }else{
        state = "fail";
        msg = text.msg;
        Edit_FailDialog(text.msg);
        return (msg?msg:"修改失败");
      }
      newText = text.outline;
      const newTextArray = newText;
      for (let i = 0; i < elements.length; ++i) {
        if (elements[i].isPartial()) {
          const element = elements[i].getElement().asText();
          const startIndex = elements[i].getStartOffset();
          const endIndex = elements[i].getEndOffsetInclusive();
          element.deleteText(startIndex, endIndex);
          if(i == elements.length - 1){
            break;
          }
          if (!replaced) {
            // 插入第一个段落
            element.insertText(startIndex, newTextArray[0]).setFontSize(15);
            replaced = true;
          } else {
            if(i == elements.length - 1 && element.length != 1){
              //DocumentApp.getActiveDocument().getBody().appendParagraph("break").setFontSize(25);
              break;
            }
            // 逐个插入剩余的段落
            for (let j = 1; j < newTextArray.length; j++) {
              const parentElement = element.getParent();
              const elementIndex = parentElement.getChildIndex(element);
              const newParagraph = parentElement.insertParagraph(elementIndex + j + 1, "");
              newParagraph.appendText(newTextArray[j]).setFontSize(15);
            }
          }
        } else {
          const element = elements[i].getElement();
          if (!replaced && element.editAsText) {
            element.clear();
            element.asText().setText(newTextArray[0]).setFontSize(15);
            replaced = true;
            // 逐个插入剩余的段落
            for (let j = 1; j < newTextArray.length; j++) {
              const parentElement = element.getParent();
              const elementIndex = parentElement.getChildIndex(element);
              const newParagraph = parentElement.insertParagraph(elementIndex + j + 1, "");
              newParagraph.appendText(newTextArray[j]).setFontSize(15);
            }
          } else {
            if (element.getNextSibling()) {
              element.removeFromParent();
            } else {
              element.clear();
            }
          }
        }
      }
    }else if(!(tmptitle && tmptitle.includes(text)) &&
    !(tmpabstract && tmpabstract.includes(text)) &&
    !(tmpoutline && tmpoutline.includes(text)) && 
    (tmpsection && tmpsection.includes(text))){
      const element = selection.getSelectedElements()[0].getElement().asText();
      const paragraphElement = element.getParent();
      var selected_section = paragraphElement.getText();
      const mark_section = selected_section.replace(text,  "<待修改内容>" + text + "</待修改内容>")
      const selectedElement = selection.getRangeElements()[0].getElement();
      const previousSibling = selectedElement.getParent().getPreviousSibling();
      var data = {
        'title': PropertiesService.getScriptProperties().getProperty('title'),
        'abstract': PropertiesService.getScriptProperties().getProperty('abstract'),
        'outline': PropertiesService.getScriptProperties().getProperty('outline'),
        'section_route': previousSibling.asText().getText().toString(),
        'paragraph': text,
        'instruction': form.instruction,
        'id': PropertiesService.getScriptProperties().getProperty('id'),
        'token': 'fdsaghoawhglejfkldashf123lk12h@'
      };
      var options = {
        'method': 'POST',
        'contentType': 'text/plain',
        'payload' : JSON.stringify(data)
      };
      var response = UrlFetchApp.fetch('http://36.103.203.43:8010/draft/edit',options);
      //DocumentApp.getActiveDocument().getBody().appendParagraph("get response").setFontSize(25);
      text = Utilities.jsonParse(response);
      if(text.status == "success"){
        explain = text.explain;
        Edit_SuccessDialog(text.explain);
      }else{
        msg = text.msg;
        Edit_FailDialog(text.msg);
        return (msg?msg:"修改失败");
      }
      newText = text.paragraph;
      for (let i = 0; i < elements.length; ++i) {
        if (elements[i].isPartial()) {
          const element = elements[i].getElement().asText();
          const startIndex = elements[i].getStartOffset();
          const endIndex = elements[i].getEndOffsetInclusive();
          element.deleteText(startIndex, endIndex);
          if (!replaced) {
            element.insertText(startIndex, newText).setFontSize(12);
            replaced = true;
          } else {
            const parent = element.getParent();
            const remainingText = element.getText().substring(endIndex + 1);
            parent.getPreviousSibling().asText().appendText(remainingText);
            if (parent.getNextSibling()) {
              parent.removeFromParent();
            } else {
              element.removeFromParent();
            }
          }
        } else {
          const element = elements[i].getElement();
          if (!replaced && element.editAsText) {
            element.clear();
            element.asText().setText(newText).setFontSize(12);
            replaced = true;
          } else {
            if (element.getNextSibling()) {
              element.removeFromParent();
            } else {
              element.clear();
            }
          }
        }
      }
    }else{
      Reselect_Dialog();
      return "请重新选择修改部分";
    }
    return (explain?explain:"修改成功");
  }
}

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
      outline += (str + ' ' + text.outline[i].section + "\\n");
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
    outline += (str + ' ' + a.sub[k].section + "\\n");
    if(a.sub[k].sub[0] != {}){
      recursion_json(a.sub[k]);
    }
  }
}

//段落生成函数
function section_generate() {
  const selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    let replaced = false;
    const elements = selection.getSelectedElements();
    if (elements.length === 1 && elements[0].getElement().getType() ===
      DocumentApp.ElementType.INLINE_IMAGE) {
      throw new Error('Can\'t insert text into an image.');
    }
    let text = "";
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i].getElement();
      const elementType = element.getType();
      if (elementType === DocumentApp.ElementType.TEXT) {
        text += element.asText().getText();
      }
    }
    if(!PropertiesService.getScriptProperties().getProperty("outline").includes(text)){
      Reselect_Dialog();
      return "请重新选择修改部分";
    }
    var data = {
      'title': PropertiesService.getScriptProperties().getProperty('title'),
      'abstract': PropertiesService.getScriptProperties().getProperty('abstract'),
      'outline': PropertiesService.getScriptProperties().getProperty('outline'),
      'section_route': text.toString(),
      'id' : PropertiesService.getScriptProperties().getProperty('id'),
      'token': 'fdsaghoawhglejfkldashf123lk12h@',
    };
    var options = {
      'method': 'POST',
      'contentType': 'text/plain',
      'payload' : JSON.stringify(data)
    };
    var response = UrlFetchApp.fetch('http://36.103.203.43:8010/draft/write',options);
    text = Utilities.jsonParse(response);
    if(text.status == "success"){
      Section_generation_SuccessDialog()
    }else{
      //var ui = DocumentApp.getUi();
      var message = text.msg;
      //ui.alert("提示", message, ui.ButtonSet.OK);
      Section_generation_FailDialog(message);
      return
    }
    newText = text.paragraph.toString() + '\n';
    for (let i = 0; i < elements.length; ++i) {
      if (elements[i].isPartial()) {
        const element = elements[i].getElement().asText();
        const startIndex = elements[i].getStartOffset();
        const endIndex = elements[i].getEndOffsetInclusive();
        //element.deleteText(startIndex, endIndex);
        if (!replaced) {
          //element.insertText(endIndex + 1, newText);
          var next_element = element.getParent().getNextSibling();
          if(next_element){
            next_element = next_element.asParagraph();
            var doc = DocumentApp.getActiveDocument();
            var index = doc.getBody().getChildIndex(next_element);
            doc.getBody().insertParagraph(index, newText).setFontSize(12);
          }else{
            var doc = DocumentApp.getActiveDocument();
            doc.getBody().appendParagraph(newText).setFontSize(12);
          }
          replaced = true;
        } else {
          // This block handles a selection that ends with a partial element. We
          // want to copy this partial text to the previous element so we don't
          // have a line-break before the last partial.
          const parent = element.getParent();
          const remainingText = element.getText().substring(endIndex + 1);
          parent.getPreviousSibling().asText().appendText(remainingText);
          // We cannot remove the last paragraph of a doc. If this is the case,
          // just remove the text within the last paragraph instead.
          if (parent.getNextSibling()) {
            parent.removeFromParent();
          } else {
            element.removeFromParent();
          }
        }
      } else {
        const element = elements[i].getElement();
        if (!replaced && element.editAsText) {
          // Only translate elements that can be edited as text, removing other
          // elements.
          element.clear();
          element.asText().setText(newText);
          replaced = true;
        } else {
          // We cannot remove the last paragraph of a doc. If this is the case,
          // just clear the element.
          if (element.getNextSibling()) {
            element.removeFromParent();
          } else {
            element.clear();
          }
        }
      }
    }
  } else {
    // const cursor = DocumentApp.getActiveDocument().getCursor();
    // const surroundingText = cursor.getSurroundingText().getText();
    // const surroundingTextOffset = cursor.getSurroundingTextOffset();

    // // If the cursor follows or preceds a non-space character, insert a space
    // // between the character and the translation. Otherwise, just insert the
    // // translation.
    // if (surroundingTextOffset > 0) {
    //   if (surroundingText.charAt(surroundingTextOffset - 1) !== ' ') {
    //     newText = ' ' + newText;
    //   }
    // }
    // if (surroundingTextOffset < surroundingText.length) {
    //   if (surroundingText.charAt(surroundingTextOffset) !== ' ') {
    //     newText += ' ';
    //   }
    // }
    // cursor.insertText(newText);
  }
  return "段落生成成功！"
}

function Waiting_Dialog() {
  var html = HtmlService.createHtmlOutputFromFile('Waiting_dialog')
      .setWidth(200)
      .setHeight(100);
  DocumentApp.getUi().showModalDialog(html, 'Please Wait');
  //alert("!!!");
  // DocumentApp.getUi().alert("jaewiofahjweuo");
  // DocumentApp.getActiveDocument().getBody().appendParagraph("enter");
  // // var text = "Please Wait";
  // // var js = "<script></script>";;
  // // var html = HtmlService.createHtmlOutput(js)
  // //       .setWidth(200)
  // //       .setHeight(100);
  // // DocumentApp.getUi().showModelessDialog(html, text);
}

function Upload_SuccessDialog() {
  var text = "Success!";
  var js = "<script></script>";;
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, text);
}

function Upload_FailDialog() {
  var text = "Fail!! Please try again or make sure the file is pdf";
  var js = "<script></script>";;
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, text);
}

function Outline_generation_SuccessDialog() {
  var text = "Success!";
  var js = "<script></script>";;
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, text);
}

function Outline_generation_FailDialog(){
  var text = "对不起我无法理解你的描述，请换个标题或是说法";
  var js = "<script></script>";;
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, text);
}

function Edit_SuccessDialog(explain){
  var text = "Success";
  var js = "<script></script>";
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, text);
}

function Edit_FailDialog(msg){
  var text = "Fail!";
  var js = "<script></script>";
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, text);
}

function Section_generation_SuccessDialog(){
  var text = "Success!";
  var js = "<script></script>";
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, text);
}

function Section_generation_FailDialog(msg){
  var text = "Fail!";
  var js = "<script></script>";
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, text);
}

function Null_select_Dialog(){
  var text = "请选中相应部分进行修改";
  var js = "<script></script>";
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(200)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, text);
}

function Reselect_Dialog(){
  var text = "请重新选择修改部分";
  var js = "<script></script>";
  var html = HtmlService.createHtmlOutput(js)
        .setWidth(300)
        .setHeight(100);
  DocumentApp.getUi().showModelessDialog(html, text);
}

function createNewTrigger() {
  var trigger = ScriptApp.newTrigger('update')
      .timeBased()
      .everyMinutes(1) // 设置每分钟运行一次
      .create();
}

function update() {
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  // 模拟每秒钟运行一次
  for (var i = 0; i < 60; i++) {
    var outline = "";
    var section = "";
    var paragraphs = body.getParagraphs();
    for(var j = 0; j < paragraphs.length; j++){
      if(paragraphs[j].getFontSize() == 15){
        outline += paragraphs[j].getText();
        outline += '\n';
      }
    }
    for(var j = 0; j < paragraphs.length; j++){
      if(paragraphs[j].getFontSize() == 12 && j != 3){
        section += paragraphs[j].getText();
      }
    }
    PropertiesService.getScriptProperties().setProperties(
      {
        'title':paragraphs[1].getText().toString(),
        'abstract':paragraphs[3].getText().toString(),
        'outline':outline.toString(),
        'section':section.toString(),
      }
    );
    Utilities.sleep(1000); // 休眠 1 秒钟
  }
}

function upload(form) {
  try {
    var file = form.reference;
    var blob;
    var encodefile;
    var filename;
    if (file.getContentType() === 'application/pdf') {
      blob = file.getAs('application/pdf');
      encodefile = Utilities.base64Encode(blob.getBytes());
      filename = file.getName();
    }else{
      Upload_FailDialog();
      return;
    }
    if(encodefile){

    }else{
      DocumentApp.getActiveDocument().getBody().appendParagraph("None");
    }
    var data = {
      'url': form.url,
      'token': 'fdsaghoawhglejfkldashf123lk12h@',
      'file': encodefile,
    };
    var options = {
      'method': 'post',
      'payload': JSON.stringify(data),
      'contentType': 'text/plain',
    };
    var response = UrlFetchApp.fetch('http://36.103.203.43:8010/upload',options);
    if (response.getResponseCode() == 200) {
      var text = response.getContentText();
      var obj = JSON.parse(text);
      //DocumentApp.getActiveDocument().getBody().appendParagraph(obj.id);
      var tmp = PropertiesService.getScriptProperties().getProperty('id');
      if(tmp == null){
        PropertiesService.getScriptProperties().setProperties({
            'id': JSON.stringify([]),
            'id_name': JSON.stringify([]),
        })
      }
      var pair = JSON.parse(PropertiesService.getScriptProperties().getProperty('id_name')) || [];
      var newpair = {
        key: filename,
        value: obj.id
      };
      pair.push(newpair);
      var list = pair.map(function(pair) {
        return pair.value;
        });
      PropertiesService.getScriptProperties().setProperties({
        'id': JSON.stringify(list),
        'id_name': JSON.stringify(pair)
      })
      Upload_SuccessDialog();
      return filename;
    } else {
      Upload_FailDialog();
      //DocumentApp.getActiveDocument().getBody().appendParagraph("Request failed. Error code: " + response.getResponseCode());
    }
  } catch(e) {
    //DocumentApp.getActiveDocument().getBody().appendParagraph("Error: " + e);
    //DocumentApp.getActiveDocument().getBody().appendParagraph(PropertiesService.getScriptProperties().getProperty('id').toString());
  }
}

function delete_file(filename){
  var keyToRemove = filename;
  //var keyToRemove = "2005.14165.pdf";
  var pair = JSON.parse(PropertiesService.getScriptProperties().getProperty('id_name')) || [];
  var pair = pair.filter(function(pair) {
    return pair.key !== keyToRemove;
    });
  var list = pair.map(function(pair) {
    return pair.value;
    });
  PropertiesService.getScriptProperties().setProperties({
    'id': JSON.stringify(list),
    'id_name': JSON.stringify(pair)
  })
}

function is_select() {
  const selection = DocumentApp.getActiveDocument().getSelection();
  if(selection){
    return 1;
  }else{
    return 2;
  }
}