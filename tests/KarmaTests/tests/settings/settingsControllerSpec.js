define(['settings/settingsController','settings/settingsView'],
  function (controllerCtor, viewCtor) {

    describe('Question Validator controller', function () {

      var controller, view;

      beforeEach(function () {
        view = viewCtor();
        controller = controllerCtor();
      });

      it('should call view.init event lsitners',
         function () {
           spyOn(view, "showImportFileSelector");
           spyOn(view, "closeImportFileSelector");
           spyOn(view, "importFromFileSelector");


           var result = controller.bindEventListeners();

           expect(view.showImportFileSelector).toHaveBeenCalled();
           expect(view.closeImportFileSelector).not.toHaveBeenCalled();
         });

    });
  });
