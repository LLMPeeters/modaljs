<h1>Modaljs</h1>
<h2>Parameters</h2>
<dl>
    <dt>modalHtml</dt>
    <dd>This is the HTML which will be given as innerHTML on the modal's container div.</dd>
    <dt>clickTriggers</dt>
    <dd>An array (or NodeList) of Element objects, which will trigger the modal with a click event.</dd>
    <dt>modalClasses (optional)</dt>
    <dd>An array of strings, which will be attached to the modal's container div as classes.</dd>
    <dt>modalHtmlUrl (optional)</dt>
    <dd>A string which will be used as a URL to make a GET request. The body of the response will be set as the innerHTML of the modal's container div. This will then replace the modalHtml parameter, which is always set.</dd>
    <dt>activeClassModal (optional)</dt>
    <dd>If set, no inline styling will be applied to the modal's container div. If empty, basic inline styling will be applied.</dd>
    <dt>activeClassBody (optional)</dt>
    <dd>If set, no inline styling will be applied to the body of the page. If unset, the CSS properties overflow-y, overflow-x, and position may be set inline.</dd>
</dl>
<h2>Example</h2>
<pre>const triggers = document.querySelectorAll(`.modal-trigger`);
const modal = new Modal(
    `Hello!`,
    triggers,
    [`my-modal-class`],
    `https://mywebsite.com`,
    `modal-active`,
    `freeze`
);</pre>
<p>The modal will now work!</p>