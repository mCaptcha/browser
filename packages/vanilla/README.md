<div align="center">

  <h1>Vanilla JavaScript Glue JavaScript library</h1>

<strong>Embed mCaptcha widget in webpages built using Vanilla JavaScript</strong>

[![0.1.0](https://img.shields.io/badge/TypeScript_docs-master-2b7489)](https://mcaptcha.github.io/glue/vanilla)
![Build)](<https://github.com/mCaptcha/glue/workflows/CI%20(Linux)/badge.svg>)
[![codecov](https://codecov.io/gh/mCaptcha/glue/branch/master/graph/badge.svg)](https://codecov.io/gh/mCaptcha/glue)

</div>

## Usage

Add this snippet to the form which requires to be protected using mCaptcha

```html
<form>
...
<div
  class="mcaptcha" 
  data-sitekey="{{ siteKey }}"
  data-instance_url="{{ mcaptchaUrl | 'http://localhost:7000/') }}"
  data-callback="{{ callbackFunctionName | optional }}">
</div>
...
</form>
<script>const callbackFunctionName = () => {}</script>
<script src="https://unpkg.com/@mcaptcha/vanilla-glue@0.2.0-rc2/dist/index.js" defer async />
```

## Example

See example form in [./static/embeded.html](./static/embeded.html)
