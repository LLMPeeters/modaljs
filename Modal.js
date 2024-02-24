export default class Modal
{
    hasFetched = false;
    isActive = false;
    /** @type {null|Function} */
    windowKeydownHandler = null;
    /** @type {null|string} */
    modalHtmlUrl = null;
    /** @type {null|string} */
    activeClassModal = null;
    /** @type {null|string} */
    activeClassBody = null;
    /** @type {Element} */
    modal;

    /**
     * @param {string} modalHtml
     * @param {Array.<Element>|NodeList.<Element>} clickTriggers
     * @param {Array.<string>} modalClasses
     * @param {string} modalHtmlUrl
     * @param {string} activeClassModal
     * @param {string} activeClassBody
     */
    constructor(
        modalHtml,
        clickTriggers,
        modalClasses = [],
        modalHtmlUrl = ``,
        activeClassModal = ``,
        activeClassBody = ``,
    )
    {
        if (!Array.isArray(modalClasses)) {
            console.error(`Modal: The modalClasses parameter is not an array. Cannot initialize.`);

            return;
        } else if (!(Array.isArray(clickTriggers) || clickTriggers instanceof NodeList)) {
            console.error(`Modal: The clickTriggers parameter is not an array or NodeList. Cannot initialize.`);

            return;
        } else if (0 >= clickTriggers.length) {
            console.error(`Modal: The clickTriggers parameter is empty. Cannot initialize.`);

            return;
        } else if (`string` !== typeof modalHtml) {
            console.error(`Modal: The modalHtml parameter is not a string. Cannot initialize.`);
        }
        this.#initParameterModal(modalHtml, modalClasses);
        this.#initModalBackground();
        this.modalBackground.addEventListener(`click`, () => this.setInactive());
        this.activeClassModal = (`string` === typeof activeClassModal && `` !== activeClassModal) ? activeClassModal : null;
        this.activeClassBody = (`string` === typeof activeClassBody && `` !== activeClassBody) ? activeClassBody : null;
        this.modalHtmlUrl = (`string` === typeof modalHtmlUrl && `` !== modalHtmlUrl) ? modalHtmlUrl : null;

        for (const clickTrigger of clickTriggers) {
            if (clickTrigger instanceof Element) {
                clickTrigger.addEventListener(`click`, () => this.setActive());
            } else {
                console.info(`Modal: Given clickTrigger is not instanceof Element. Skipped.`);
            }
        }
    }

    /**
     * @param {string}modalHtml
     * @param {Array.<string>} modalClasses
     */
    #initParameterModal(modalHtml, modalClasses)
    {
        this.modal = document.createElement(`div`);

        for (const className of modalClasses) {
            if (`string` === typeof className) {
                this.modal.classList.add(className);
            } else {
                console.info(`Modal: Given class is not a string. Skipped.`);
            }
        }
        if (`string` !== typeof this.modal.getAttribute(`class`)) {
            this.#initModalInlineStyle();
        }
        this.modal.innerHTML = modalHtml;
    }

    #initModalInlineStyle()
    {
        this.modal.style.setProperty(`display`, `none`);
        this.modal.style.setProperty(`position`, `fixed`);
        this.modal.style.setProperty(`z-index`, `10000`);
        this.modal.style.setProperty(`top`, `10vh`);
        this.modal.style.setProperty(`left`, `50vw`);
        this.modal.style.setProperty(`min-width`, `300px`);
        this.modal.style.setProperty(`max-width`, `100vw`);
        this.modal.style.setProperty(`min-height`, `33vh`);
        this.modal.style.setProperty(`max-height`, `80vh`);
        this.modal.style.setProperty(`transform`, `translate(-50%)`);
        this.modal.style.setProperty(`background-color`, `#fefefeff`);
    }

    #initModalBackground()
    {
        this.modalBackground = document.createElement(`div`);

        this.modalBackground.style.setProperty(`position`, `fixed`);
        this.modalBackground.style.setProperty(`z-index`, `9999`);
        this.modalBackground.style.setProperty(`width`, `100vw`);
        this.modalBackground.style.setProperty(`height`, `100vh`);
        this.modalBackground.style.setProperty(`background-color`, `#000000CC`);
    }

    addWindowKeydownHandler()
    {
        if (`function` !== typeof this.windowKeydownHandler) {
            const modalComponent = this;
            /** @param {KeyboardEvent} event */
            this.windowKeydownHandler = function(event) {
                if (modalComponent.isActive && `Escape` === event.code) {
                    modalComponent.setInactive();
                }
            }
        }

        window.addEventListener(`keydown`, this.windowKeydownHandler);
    }

    removeWindowKeydownHandler()
    {
        if (`function` !== typeof this.windowKeydownHandler) {
            return;
        }

        window.removeEventListener(`keydown`, this.windowKeydownHandler);
    }

    setActive()
    {
        document.body.insertAdjacentElement(`beforeend`, this.modal);
        this.modal.insertAdjacentElement(`beforebegin`, this.modalBackground);

        if (`string` === typeof this.activeClassModal) {
            this.modal.classList.add(this.activeClassModal);
        } else {
            this.modal.style.setProperty(`display`, `block`);
        }
        this.modalBackground.style.setProperty(`display`, `block`);

        if (`string` === typeof this.activeClassBody) {
            document.body.classList.remove(this.activeClassBody);
        } else {
            if (document.body.offsetHeight > window.innerHeight) {
                document.body.style.setProperty(`overflow-y`, `scroll`);
            }
            if (document.body.offsetWidth > window.innerWidth) {
                document.body.style.setProperty(`overflow-y`, `scroll`);
            }
            document.body.style.setProperty(`position`, `fixed`);
        }

        if (!this.hasFetched && `string` === typeof this.modalHtmlUrl && `` !== this.modalHtmlUrl) {
            fetch(this.modalHtmlUrl)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Invalid response given for modal HTML.`);
                    }

                    return response.text();
                })
                .then((body) => this.modal.innerHTML = body)
                .catch(() => console.error(`Modal: Request failed.`))
            ;
            this.hasFetched = true;
        }

        this.isActive = true;
        this.addWindowKeydownHandler();
    }

    setInactive()
    {
        if (`string` === typeof this.activeClassModal) {
            this.modal.classList.remove(this.activeClassModal);
        } else {
            this.modal.style.setProperty(`display`, `none`);
        }
        this.modalBackground.style.setProperty(`display`, `none`);

        if (`string` === typeof this.activeClassBody) {
            document.body.classList.remove(this.activeClassBody);
        } else {
            document.body.style.removeProperty(`overflow-y`);
            document.body.style.removeProperty(`overflow-x`);
            document.body.style.removeProperty(`position`);
        }

        this.modal.remove();
        this.modalBackground.remove();
        this.isActive = false;
        this.removeWindowKeydownHandler();
    }
};