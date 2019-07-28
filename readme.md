<h1><strong>ESTA Clinic</strong></h1>
<ol>
	<li>Install Node Modules: <strong>npm i</strong>;</li>
	<li>Run the template: <strong>gulp</strong>.</li>
</ol>

For apple users, downgrade to older npm:
    sudo npm install -g n
    sudo n 10.16.0
    npm install
    npm rebuild node-sass
    node -v
    gulp


<h2>Gulp tasks:</h2>

<ul>
	<li><strong>gulp</strong>: run default gulp task (sass, js, watch, browserSync) for web development;</li>
	<li><strong>gulp build</strong>: run production build with image and code minifications</li>
</ul>

<h2>Setup mail posting:</h2>

<ul>
	<li><strong>mail.php</strong> should be sibling for html pages</li>
	<li>replace in forms `YOUR_EMAIL_ADRESS_HERE@DOMAIN_NAME.LOCALE` for your specific mail</li>
</ul>