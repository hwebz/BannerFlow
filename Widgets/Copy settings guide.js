// 1. Open console (Developer tools -> Console)
// 2. Open the code editor of the widget you would like to clone
// 3. Extract settings from the widget currently open (copy to clipboard)
ko.toJSON(editor.editWidgetDialog().propertySettings())
//4. Now open the widget you would like to export your settings to and run the following code in the console (replace string containging the settings)
editor.editWidgetDialog().propertySettings(ko.utils.arrayMap(JSON.parse('[{"key":"starColor","default":"#ffffff","dataType":4,"enabled":true,"niceName":"Star color","icon":"star","description":""}]'), function(s) {
return new WidgetResourceSetting(s)
}));
