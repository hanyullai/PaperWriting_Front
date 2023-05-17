//大纲修改函数
function outline_edit(form) {
  var paragraphs = DocumentApp.getActiveDocument().getBody().getParagraphs(); 
  const selection = DocumentApp.getActiveDocument().getSelection();
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
        //text += element.asText().getText();
      } else if (elementType === DocumentApp.ElementType.PARAGRAPH) {
        // const paragraph = element.asParagraph();
        // const start = elements[i].getStartOffset();
        // const end = elements[i].getEndOffsetInclusive();
        // text += paragraph.getText().substring(start, end + 1);
        // text += '\n';
        const paragraph = element.asParagraph();
        text += paragraph.getText();
        text += '\n'
      }
    }
    //var tmpabstract = PropertiesService.getScriptProperties().getProperty("abstract").replace(/[\n]/g, '');
    //DocumentApp.getActiveDocument().getBody().appendParagraph(text).setFontSize(25);
    // if(text == PropertiesService.getScriptProperties().getProperty("abstract")){
    //   DocumentApp.getActiveDocument().getBody().appendParagraph("true");
    // }else{
    //   DocumentApp.getActiveDocument().getBody().appendParagraph("false");
    // }
    if(PropertiesService.getScriptProperties().getProperty("title").includes(text) && 
    !PropertiesService.getScriptProperties().getProperty("abstract").includes(text) &&
    !PropertiesService.getScriptProperties().getProperty("outline").includes(text) && 
    !PropertiesService.getScriptProperties().getProperty("section").includes(text)){
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
        // var ui = DocumentApp.getUi();
        var message = "标题修改：" + "\n" + text.explain;
        // ui.alert("提示", message, ui.ButtonSet.OK);
        Edit_SuccessDialog(message);
      }else{
        //var ui = DocumentApp.getUi();
        var message = text.msg;
        //ui.alert("标题修改失败", message, ui.ButtonSet.OK);
        Edit_FailDialog(message);
        return
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
            element.asText().setText(newText).setFontSize(20);
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
    } else if(!PropertiesService.getScriptProperties().getProperty("title").includes(text) && 
    (PropertiesService.getScriptProperties().getProperty("abstract").includes(text))&&
    !PropertiesService.getScriptProperties().getProperty("outline").includes(text) && 
    !PropertiesService.getScriptProperties().getProperty("section").includes(text)){
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
        //var ui = DocumentApp.getUi();
        var message = "摘要修改：" + "\n" + text.explain;
        //ui.alert("提示", message, ui.ButtonSet.OK);
        Edit_SuccessDialog(message);
      }else{
        //var ui = DocumentApp.getUi();
        var message = text.msg;
        //ui.alert("摘要修改失败", message, ui.ButtonSet.OK);
        Edit_FailDialog(message);
        return
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
            element.asText().setText(newText).setFontSize(12);
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
    }else if(!PropertiesService.getScriptProperties().getProperty("title").includes(text) && 
    !PropertiesService.getScriptProperties().getProperty("abstract").includes(text) &&
    PropertiesService.getScriptProperties().getProperty("outline").includes(text) && 
    !PropertiesService.getScriptProperties().getProperty("section").includes(text)){
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
        //var ui = DocumentApp.getUi();
        var message = "大纲修改：" + "\n" + text.explain;
        //ui.alert("提示", message, ui.ButtonSet.OK);
        Edit_SuccessDialog(message);
      }else{
        //var ui = DocumentApp.getUi();
        var message = text.msg;
        //ui.alert("大纲修改失败", message, ui.ButtonSet.OK);
        Edit_FailDialog(message);
        return
      }
      newText = text.outline;
      //DocumentApp.getActiveDocument().getBody().appendParagraph(newText);
      // 分割 newText 字符串为一个段落数组
      const newTextArray = newText;
      for (let i = 0; i < elements.length; ++i) {
        if (elements[i].isPartial()) {
          const element = elements[i].getElement().asText();
          const startIndex = elements[i].getStartOffset();
          const endIndex = elements[i].getEndOffsetInclusive();
          element.deleteText(startIndex, endIndex);
          if (!replaced) {
            // 插入第一个段落
            element.insertText(startIndex, newTextArray[0]).setFontSize(15);
            replaced = true;
          } else {
            // 逐个插入剩余的段落
            newTextArray[j] = newTextArray[j].replace(/\n/g, "");  
            const parentElement = element.getParent();
            const elementIndex = parentElement.getChildIndex(element);
            const newParagraph = parentElement.insertParagraph(elementIndex + j + 1, "");
            newParagraph.appendText(newTextArray[j]).setFontSize(15);
          }
        } else {
          const element = elements[i].getElement();
          if (!replaced && element.editAsText) {
            // Only translate elements that can be edited as text, removing other
            // elements.
            element.clear();
            element.asText().setText(newTextArray[0]).setFontSize(15);
            replaced = true;
            // 逐个插入剩余的段落
            for (let j = 1; j < newTextArray.length; j++) {
              newTextArray[j] = newTextArray[j].replace(/\n/g, "");  
              const parentElement = element.getParent();
              const elementIndex = parentElement.getChildIndex(element);
              const newParagraph = parentElement.insertParagraph(elementIndex + j + 1, "");
              newParagraph.appendText(newTextArray[j]).setFontSize(15);
            }
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
    }else if(!PropertiesService.getScriptProperties().getProperty("title").includes(text) && 
    !PropertiesService.getScriptProperties().getProperty("abstract").includes(text) &&
    !PropertiesService.getScriptProperties().getProperty("outline").includes(text) && 
    PropertiesService.getScriptProperties().getProperty("section").includes(text)){
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
        'paragraph': mark_section,
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
      text = Utilities.jsonParse(response);
      if(text.status == "success"){
        //var ui = DocumentApp.getUi();
        var message = "段落修改：" + "\n" + text.explain;
        //ui.alert("提示", message, ui.ButtonSet.OK);
        Edit_SuccessDialog(message);
      }else{
        //var ui = DocumentApp.getUi();
        var message = text.msg;
        //ui.alert("段落修改失败", message, ui.ButtonSet.OK);
        Edit_FailDialog(message);
        return
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
            element.asText().setText(newText).setFontSize(12);
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
    }else{
      // var ui = DocumentApp.getUi();
      // var message = "请重新选择修改部分";
      // ui.alert("失败", message, ui.ButtonSet.OK);
      Reselect_Dialog();
      return
    }
  }
}
    // let replaced = false;
    // const elements = selection.getSelectedElements();
    // if (elements.length === 1 && elements[0].getElement().getType() ===
    //   DocumentApp.ElementType.INLINE_IMAGE) {
    //   throw new Error('Can\'t insert text into an image.');
    // }
    // let text = "";
    // for (let i = 0; i < elements.length; i++) {
    //   const element = elements[i].getElement();
    //   const elementType = element.getType();
    //   if (elementType === DocumentApp.ElementType.TEXT) {
    //     text += element.asText().getText();
    //   }
    // }
    //DocumentApp.getActiveDocument().getBody().appendParagraph(text)
    //text = text.replace(/[\n]/g, '');
    //var outline = PropertiesService.getScriptProperties().getProperty("outline");
    //DocumentApp.getActiveDocument().getBody().appendParagraph(text);
    //var re = new RegExp(text, 'g'); // 创建正则表达式，'g' 表示全局匹配
    //var result = outline.replace(re, "<待修改内容>" + text + "</待修改内容>"); // 在匹配到的字符串前后添加标记
    // DocumentApp.getActiveDocument().getBody().appendParagraph(text);
    //DocumentApp.getActiveDocument().getBody().appendParagraph(result).setFontSize(12);
    // var data = {
    //   'title': PropertiesService.getScriptProperties().getProperty('title'),
    //   'outline':text,
    //   'instruction': form.instruction,
    //   'id': PropertiesService.getScriptProperties().getProperty('id'),
    //   'token': 'fdsaghoawhglejfkldashf123lk12h@'
    // };
    // var options = {
    //   'method': 'POST',
    //   'contentType': 'text/plain',
    //   'payload' : JSON.stringify(data)
    // };
    // var response = UrlFetchApp.fetch('http://36.103.203.43:8010/outline/edit_outline',options);
    // text = Utilities.jsonParse(response);
    // if(text.status == "success"){
    //   var ui = DocumentApp.getUi();
    //   var message = text.explain;
    //   ui.alert("提示", message, ui.ButtonSet.OK);
    // }else{
    //   var ui = DocumentApp.getUi();
    //   var message = text.msg;
    //   ui.alert("失败", message, ui.ButtonSet.OK);
    //   return
    // }
    // newText = text.outline;
    // // 分割 newText 字符串为一个段落数组
    // const newTextArray = newText.split("\n");
    // for (let i = 0; i < elements.length; ++i) {
    //   if (elements[i].isPartial()) {
    //     const element = elements[i].getElement().asText();
    //     const startIndex = elements[i].getStartOffset();
    //     const endIndex = elements[i].getEndOffsetInclusive();
    //     element.deleteText(startIndex, endIndex);
    //     if (!replaced) {
    //       // 插入第一个段落
    //       element.insertText(startIndex, newTextArray[0]).setFontSize(15);
    //       replaced = true;
    //     } else {
    //       // 逐个插入剩余的段落
    //       for (let j = 1; j < newTextArray.length; j++) {
    //         const newParagraph = element.getParent().insertParagraph(startIndex + j);
    //         newParagraph.appendText(newTextArray[j]).setFontSize(15);
    //       }
    //     }
    //   } else {
    //     const element = elements[i].getElement();
    //     if (!replaced && element.editAsText) {
    //       // Only translate elements that can be edited as text, removing other
    //       // elements.
    //       element.clear();
    //       element.asText().setText(newTextArray[0]).setFontSize(15);
    //       replaced = true;
    //       // 逐个插入剩余的段落
    //       for (let j = 1; j < newTextArray.length; j++) {
    //         const newParagraph = element.getParent().insertParagraph(element.getParent().getChildIndex(element) + j);
    //         newParagraph.appendText(newTextArray[j]).setFontSize(15);
    //       }
    //     } else {
    //       // We cannot remove the last paragraph of a doc. If this is the case,
    //       // just clear the element.
    //       if (element.getNextSibling()) {
    //         element.removeFromParent();
    //       } else {
    //         element.clear();
    //       }
    //     }
    //   }
    // }

    // for (let i = 0; i < elements.length; ++i) {
    //   if (elements[i].isPartial()) {
    //     const element = elements[i].getElement().asText();
    //     const startIndex = elements[i].getStartOffset();
    //     const endIndex = elements[i].getEndOffsetInclusive();
    //     element.deleteText(startIndex, endIndex);
    //     if (!replaced) {
    //       element.insertText(startIndex, newText).setFontSize(15);
    //       replaced = true;
    //     } else {
    //       // This block handles a selection that ends with a partial element. We
    //       // want to copy this partial text to the previous element so we don't
    //       // have a line-break before the last partial.
    //       const parent = element.getParent();
    //       const remainingText = element.getText().substring(endIndex + 1);
    //       parent.getPreviousSibling().asText().appendText(remainingText);
    //       // We cannot remove the last paragraph of a doc. If this is the case,
    //       // just remove the text within the last paragraph instead.
    //       if (parent.getNextSibling()) {
    //         parent.removeFromParent();
    //       } else {
    //         element.removeFromParent();
    //       }
    //     }
    //   } else {
    //     const element = elements[i].getElement();
    //     if (!replaced && element.editAsText) {
    //       // Only translate elements that can be edited as text, removing other
    //       // elements.
    //       element.clear();
    //       element.asText().setText(newText).setFontSize(15);
    //       replaced = true;
    //     } else {
    //       // We cannot remove the last paragraph of a doc. If this is the case,
    //       // just clear the element.
    //       if (element.getNextSibling()) {
    //         element.removeFromParent();
    //       } else {
    //         element.clear();
    //       }
    //     }
    //   }
    // }
//   } else {
//     const cursor = DocumentApp.getActiveDocument().getCursor();
//     const surroundingText = cursor.getSurroundingText().getText();
//     const surroundingTextOffset = cursor.getSurroundingTextOffset();

//     // If the cursor follows or preceds a non-space character, insert a space
//     // between the character and the translation. Otherwise, just insert the
//     // translation.
//     if (surroundingTextOffset > 0) {
//       if (surroundingText.charAt(surroundingTextOffset - 1) !== ' ') {
//         newText = ' ' + newText;
//       }
//     }
//     if (surroundingTextOffset < surroundingText.length) {
//       if (surroundingText.charAt(surroundingTextOffset) !== ' ') {
//         newText += ' ';
//       }
//     }
//     cursor.insertText(newText);
//   }
// }
/*
function outline_edit(form) {
  var data = {
    'title': form.title,
    'outline':"<待修改内容>" + get_section(form.s_title) + "</待修改内容>",
    'instruction': form.instruction,
    'token': 'fdsaghoawhglejfkldashf123lk12h@'
  };
  var options = {
    'method': 'POST',
    'contentType': 'text/plain',
    'payload' : JSON.stringify(data)
  };
  var response = UrlFetchApp.fetch('http://45.41.95.10:8010/outline/edit_outline',options);
  text = Utilities.jsonParse(response);
  if(text.status == "success"){
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var searchPattern = form.s_title;
    var pattern = /(\d+(\.\d+)?):.*$/;
    var replaceText = "$1:" + text.outline;
    var replaceText = searchPattern.replace(pattern, replaceText);
    var foundElement = null;
    var foundText = null;
    while (foundElement = body.findText(searchPattern, foundElement)) {
      var element = foundElement.getElement();
      var paragraph = element.getParent();
      if (paragraph.getType() == DocumentApp.ElementType.PARAGRAPH && 
          paragraph.getHeading() != DocumentApp.ParagraphHeading.NORMAL){
        foundText = foundElement.getElement().asText();
        foundText.replaceText(searchPattern, replaceText);
      }
      break;
    }
    searchPattern = replaceText;
    foundElement = null;
    foundText = null;
    while (foundElement = body.findText(searchPattern, foundElement)) {
      var foundText = foundElement.getElement().asText();
      var start = foundElement.getStartOffset();
      var end = foundElement.getEndOffsetInclusive();
      foundText.setBackgroundColor(start, end, "#ffff00");
      var ui = DocumentApp.getUi();
      var message = text.explain;
      ui.alert("成功", message, ui.ButtonSet.OK);
      break;
    }
    doc.saveAndClose();
  }else{
    var ui = DocumentApp.getUi();
    var message = text.msg;
    ui.alert("失败", message, ui.ButtonSet.OK);
  }
}
*/

