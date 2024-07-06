import xhr from "../formsubmitter/xhr.js";


export function Require() {
    // alert()
    importRequired(document);

}
export function importRequired(box) {
    let requires = box.querySelectorAll(".require");

    requires.forEach(require => {
        // 
        if (require.hasAttribute("src")) {
            new xhr({
                url: require.getAttribute("src"),
                method: "get",
                callback: (response) => {
                    // console.
                    require.innerHTML = "";
                    let vBox = document.createElement("div");
                    vBox.innerHTML = response;
                    // 
                    let SubRequires = vBox.querySelectorAll('.require');
                    if (SubRequires.length > 0) {
                        // SubRequires[0].replaceWith('<div>re</div>')
                        // alert()

                        importRequired(vBox);

                    }

                    require.replaceWith(vBox.firstChild)
                }
            })
        }

    });
}