var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();

dataTransferManager.addEventListener("datarequested", shareImageHandler);

function shareImageHandler (e) {
    var request = e.request;
    request.data.properties.title = "Shared Rainbow Paint";
    request.data.properties.description = "This is a description.";
    //var deferral = request.getDeferral();
    var image = document.getElementsByTagName("canvas")[0].toDataURL();
  /*  Windows.ApplicationModel.Package.current.installedLocation.getFileAsync(image).then(function (thumbnailFile) {
        request.data.properties.thumbnail = Windows.Storage.Streams.RandomAccessStreamReference.createFromFile(thumbnailFile);
        return Windows.ApplicationModel.Package.current.installedLocation.getFileAsync(image);
    }).done(function (imageFile) {
        request.data.setBitmap(Windows.Storage.Streams.RandomAccessStreamReference.createFromFile(image));
       deferral.complete();
    }, function (err) {
        request.failWithDisplayText(err);
    });*/
    request.data.setStorageItems([image]);
}
