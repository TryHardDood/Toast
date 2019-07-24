const CONTAINER_CLASS = "toast-container";
const WRAPPER_CLASS = "toast-wrapper";

class BsToast {

    constructor({title, subtitle, content, type, delay, position, img, icon, pause_on_hover, customClass}) {
        this.id = 'toast-' + (document.getElementsByClassName('toast').length + 1);
        this.title = title || 'Notice!';
        this.subtitle = subtitle || '';
        this.content = content || '';
        this.type = type || 'info';
        this.delay = delay || -1;
        this.position = position || 'top-right';
        this.img = img;
        this.icon = icon;
        this.pause_on_hover = pause_on_hover || false;
        this.customClass = customClass || '';

        this.pause = false;

        this.bg_header_class = '';
        this.fg_header_class = '';
        this.fg_subtitle_class = 'text-muted';
        this.fg_dismiss_class = '';

        this.delay_or_autohide = '';

        this.setupLayout();
        this.createToast();
    }

    setupLayout() {
        if (!document.getElementsByClassName(CONTAINER_CLASS + ' ' + this.position).length) {
            let container = document.createElement('div');
            container.className = CONTAINER_CLASS + ' ' + this.position;
            document.body.insertBefore(container, document.body.firstChild);
        }

        if (!document.getElementsByClassName(CONTAINER_CLASS + ' ' + this.position)[0].hasChildNodes()) {
            let wrapper = document.createElement('div');
            wrapper.className = WRAPPER_CLASS;
            document.getElementsByClassName(CONTAINER_CLASS + ' ' + this.position)[0].append(wrapper);
        }
    }

    createToast() {
        if (this.pause_on_hover !== false) {
            const hide_timestamp = Math.floor(Date.now() / 1000) + (this.delay / 1000);

            this.delay_or_autohide = 'data-autohide="false"';
            this.pause_on_hover = `data-hide-timestamp="${hide_timestamp}"`;
        } else {
            if (this.delay === -1) {
                this.delay_or_autohide = 'data-autohide="false"';
            } else {
                this.delay_or_autohide = `data-delay="${this.delay}"`;
            }
        }

        // If custom class is defined then don't style the toast by it's type.
        if(!this.customClass) {
            switch (this.type) {
                case 'info':
                    this.bg_header_class = 'bg-info';
                    this.fg_header_class = 'text-white';
                    this.fg_subtitle_class = 'text-white';
                    this.fg_dismiss_class = 'text-white';
                    break;

                case 'success':
                    this.bg_header_class = 'bg-success';
                    this.fg_header_class = 'text-white';
                    this.fg_subtitle_class = 'text-white';
                    this.fg_dismiss_class = 'text-white';
                    break;

                case 'warning':
                case 'warn':
                    this.bg_header_class = 'bg-warning';
                    this.fg_header_class = 'text-white';
                    this.fg_subtitle_class = 'text-white';
                    this.fg_dismiss_class = 'text-white';
                    break;

                case 'error':
                case 'danger':
                    this.bg_header_class = 'bg-danger';
                    this.fg_header_class = 'text-white';
                    this.fg_subtitle_class = 'text-white';
                    this.fg_dismiss_class = 'text-white';
                    break;
            }
        }

        let html = `
<div id="${this.id}" class="toast${' ' + this.customClass}" role="alert" aria-live="assertive" aria-atomic="true" ${this.delay_or_autohide} ${this.pause_on_hover}>
  <div class="toast-header ${this.bg_header_class} ${this.fg_header_class}">`;

        if (typeof this.img !== 'undefined' && typeof this.icon === 'undefined') {
            html += `<img src="${this.img.src}" class="${(this.img.class || '')} mr-2" alt="${(this.img.alt || 'Image')}" ${(typeof this.img.title !== 'undefined' ? 'data-toggle="tooltip" title="' + this.img.title + '"' : '')}>`;
        }

        if (typeof this.icon !== 'undefined' && typeof this.img === 'undefined') {
           html += this.icon;
        }

        html += `
    <strong class="mr-auto ${(typeof this.icon !== 'undefined') ? 'ml-2' : '' }">${this.title}</strong>
    <small class="${this.fg_subtitle_class}">${this.subtitle}</small>
    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
      <span aria-hidden="true" class="${this.fg_dismiss_class}">&times;</span>
    </button>
  </div>`;
        if (this.content !== '') {
            html += `<div class="toast-body">
                        ${this.content}
                      </div>`;
        }
        html += `
</div>
`;

        let toastEl = document.createElement('div');
        toastEl.innerHTML = html;

        const element = document.getElementsByClassName(CONTAINER_CLASS + ' ' + this.position)[0].firstChild.appendChild(toastEl);
        BsToast.toggleToast(this.id);

        if (this.pause_on_hover !== false) {
            let timeout = () => {
                if (!this.pause) {
                    BsToast.toggleToast(this.id, true);
                }
            };
            setTimeout(timeout, this.delay);

            element.addEventListener('mouseover', () => {
                this.pause = true;
            });

            let mouseLeave = () => {
                const current = Math.floor(Date.now() / 1000);
                const future = parseInt(element.children[0].dataset.hideTimestamp);

                this.pause = false;

                if (current >= future) {
                    BsToast.toggleToast(this.id, true);
                }
            };
            element.addEventListener('mouseleave', mouseLeave);
        }
    }

    static toggleToast(id, hide = false) {
        if (!window.jQuery && !window.$) {
            let toast = new bootstrap.Toast(document.getElementById(id));
            hide ? toast.hide() : toast.show();
        } else {
            $(`#${id}`).toast(hide ? 'hide' : 'show');
        }
    }
}
