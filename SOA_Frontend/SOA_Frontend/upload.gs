function upload(form) {
  try {
    var file = form.reference;
    var blob;
    var encodefile;
    if (file.getContentType() === 'application/pdf') {
      blob = file.getAs('application/pdf');
      encodefile = Utilities.base64Encode(blob.getBytes());
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
            'id': JSON.stringify([])
        })
      }
      var list = JSON.parse(PropertiesService.getScriptProperties().getProperty('id'));
      list.push(obj.id);
      PropertiesService.getScriptProperties().setProperties({
        'id': JSON.stringify(list)
      })
      Upload_SuccessDialog();
      // var ui = DocumentApp.getUi();
      // var message = "Successfully upload";
      // ui.alert("提示", message, ui.ButtonSet.OK);
    } else {
      Upload_FailDialog();
      //DocumentApp.getActiveDocument().getBody().appendParagraph("Request failed. Error code: " + response.getResponseCode());
    }
  } catch(e) {
    //DocumentApp.getActiveDocument().getBody().appendParagraph("Error: " + e);
    //DocumentApp.getActiveDocument().getBody().appendParagraph(PropertiesService.getScriptProperties().getProperty('id').toString());
  }
}

