export default class Notif {
  constructor() {
    this.type = "success";
    this.message = "notification";
    // this.start_delai = 5;
    this.duration = 5000;
    this.ann;
  }
  notify(type, text,Dom) {
    var notif = {
      name: "div",
      attributes: {
        class: "notif " + type,
      },
      html: {
        icon: {
          name: "i",
          attributes: {
            class: "mr-sm-2",
          },
        },
        text: {
          name: "span",
          attributes: {
            class: "",
          },
          text: "    " + text,
        },
      },
    };
    switch (type) {
      case "success":
        notif.html.icon.attributes.class = "fa fa-check";
        break;
      case "warning":
        notif.html.icon.attributes.class = "fa fa-exclamation";
        break;
      case "info":
        notif.html.icon.attributes.class = "fa fa-info";
        break;
      case "danger":
        notif.html.icon.attributes.class = "fa fa-window-close";
        break;
      default:
        break;
    }

    var notif = Dom.createElementFromStructure(notif);
    notif.style.left = window.innerWidth - (window.innerWidth * 35) / 100+"px";
    document.querySelector("body").before(notif);
    notif.style.top = window.innerHeight - (notif.offsetHeight + 30)+"px";
    var op = 0;
    var it = setInterval(function () {
      op = op + 0.01;
      notif.style.opacity = op;
      // console.log(notif)
      if (op > 0.9) {
        clearInterval(it);
      }
    }, 1);

    setTimeout(function () {
      var op = 1;
      var it = setInterval(function () {
        op = op - 0.01;
        notif.style.opacity = op;
        // console.log(notif)
        if (op < 0.01) {
          notif.remove();
          clearInterval(it);
        }
      }, 5);
    }, 5000);
  }
}
// alert()
