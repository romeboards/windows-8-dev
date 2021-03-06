﻿(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;

    function showNewRSSDialog() {
        document.getElementById("newRSS").winControl.show('add');
    }

    function addNewRSS() {
        var newRSSurl = document.getElementById("newRSSInput").value;
        document.getElementById("newRSSInput").value = "loading...";
        if (Data.addNewBlog(newRSSurl)) {
            var listView = document.querySelector(".itemslist").winControl;
            listView.forceLayout();
        }
        else {
            document.getElementById("newRSSInput").value = "invalid url... try again.";
        }
    }

    ui.Pages.define("/pages/items/items.html", {

        // This function updates the ListView with new layouts
        initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />

            if (viewState === appViewState.snapped) {
                listView.layout = new ui.ListLayout();
            } else {
                listView.layout = new ui.GridLayout();
            }
        },

        itemInvoked: function (args) {
            var groupKey = Data.groups.getAt(args.detail.itemIndex).key;
            WinJS.Navigation.navigate("/pages/split/split.html", { groupKey: groupKey });
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listView = element.querySelector(".itemslist").winControl;
            listView.itemDataSource = Data.groups.dataSource;
            listView.itemTemplate = element.querySelector(".itemtemplate");
            listView.oniteminvoked = this.itemInvoked.bind(this);

            this.initializeLayout(listView, Windows.UI.ViewManagement.ApplicationView.value);
            listView.element.focus();

            //Display the appbar but hide the Full View button
            var appbar = document.getElementById("appbar");
            var appbarCtrl = appbar.winControl;
            appbarCtrl.hideCommands(["view"], false);
            appbarCtrl.showCommands(["add"], false);

            //Event Listener for add feed button - show input form
            document.getElementById('add').addEventListener("click", showNewRSSDialog, false);

            //Event Listener for add feed confirm button
            document.getElementById('newRSSButton').addEventListener("click", addNewRSS, false);

        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />
            /// <param name="viewState" value="Windows.UI.ViewManagement.ApplicationViewState" />
            /// <param name="lastViewState" value="Windows.UI.ViewManagement.ApplicationViewState" />

            var listView = element.querySelector(".itemslist").winControl;
            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function (e) {
                        listView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    }
                    listView.addEventListener("contentanimating", handler, false);
                    var firstVisible = listView.indexOfFirstVisible;
                    this.initializeLayout(listView, viewState);
                    listView.indexOfFirstVisible = firstVisible;
                }
            }
        }
    });
})();
