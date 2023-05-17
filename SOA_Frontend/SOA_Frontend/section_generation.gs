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
}

/*
function section_generate(form){
  var doc = DocumentApp.getActiveDocument();
  var main_section = form.main_section;
  var sub_section = form.sub_section;
  if(sub_section){
    section_route = get_section(main_section.toString()) + ">" + get_section(sub_section.toString());
  }else{
    section_route = get_section(main_section.toString())
  }
  PropertiesService.getScriptProperties().setProperty('section_route', section_route.toString());
  var data = {
    'title': PropertiesService.getScriptProperties().getProperty('title'),
    'abstract': PropertiesService.getScriptProperties().getProperty('abstract'),
    'outline': PropertiesService.getScriptProperties().getProperty('outline'),
    'section_route': PropertiesService.getScriptProperties().getProperty('section_route'),
    'token': 'fdsaghoawhglejfkldashf123lk12h@',
  };
  var options = {
    'method': 'POST',
    'contentType': 'text/plain',
    'payload' : JSON.stringify(data)
  };
  var response = UrlFetchApp.fetch('http://45.41.95.10:8010/draft/write',options);
  text = Utilities.jsonParse(response);
  if(text.status == "success"){
    if(sub_section){
      search(sub_section, text, doc);
    }else{
      search(main_section, text, doc);
    }
  }else{
    var ui = DocumentApp.getUi();
    var message = text.msg;
    ui.alert("提示", message, ui.ButtonSet.OK);
  }
}

//搜索待生成段落的插入位置并插入
function search(target_section, text, doc){
  var foundElement = doc.getBody().findText(target_section);
  while (foundElement != null) {
    var element = foundElement.getElement();
    var paragraph = element.getParent();
    if (paragraph.getType() == DocumentApp.ElementType.PARAGRAPH && 
        paragraph.getHeading() != DocumentApp.ParagraphHeading.NORMAL) {
      var nextElement = paragraph.getNextSibling();
      if(nextElement == null){
        doc.getBody().appendParagraph(text.paragraph.toString());
        break;
      }
      if (nextElement.getType() == DocumentApp.ElementType.PARAGRAPH) {
        var index = doc.getBody().getChildIndex(nextElement);
        doc.getBody().insertParagraph(index, text.paragraph.toString());
        break;
      }
    }
    foundElement = doc.getBody().findText(target_section, foundElement);
  }
  var ui = DocumentApp.getUi();
  var message = "Section not found!";
  ui.alert("提示", message, ui.ButtonSet.OK);
  doc.saveAndClose();
}

//对用户输入的段落标题进行格式处理
function get_section(section){
  var str = section;
  var parts = str.split(":");
  var result = parts.length > 1 ? parts.slice(1).join(" ") : str;  // 选择数组的后一部分并将其重新组合为字符串
  return result;
}
*/

