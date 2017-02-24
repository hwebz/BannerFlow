window.onload = function(){
    var date;
    var d = document.getElementById("d-value");
    var h = document.getElementById("h-value");
    var m = document.getElementById("m-value");
    var s = document.getElementById("s-value");
    var ms = document.getElementById("ms-value");
    var displayCount = 0;
    var timerContainer = document.getElementById("timer");
    var label = document.getElementsByClassName("label");
    var delimiter = document.getElementsByClassName("delimiter");
    var value = document.getElementsByClassName("value");
    var timer;

    var fonts = ["Open Sans","Roboto","Lato","Oswald","Slabo 27px","Roboto Condensed","Lora","Source Sans Pro","Montserrat","PT Sans","Open Sans Condensed","Raleway","Droid Sans","Ubuntu","Roboto Slab","Droid Serif","Merriweather","Arimo","PT Sans Narrow","Noto Sans","Poiret One","PT Serif","Titillium Web","Indie Flower","Bitter","Alegreya Sans","Fjalla One","Dosis","Lobster","Yanone Kaffeesatz","Playfair Display","Candal","Oxygen","Hind","Cabin","Arvo","Passion One","Muli","Noto Serif","Abel","Inconsolata","Nunito","Vollkorn","Bree Serif","Orbitron","Pacifico","Archivo Narrow","Signika","Francois One","Ubuntu Condensed","Josefin Sans","Play","Shadows Into Light","Cuprum","Libre Baskerville","Asap","Maven Pro","Sigmar One","Merriweather Sans","Exo 2","Quicksand","Rokkitt","Crimson Text","Anton","PT Sans Caption","Alegreya","Varela Round","Karla","Fira Sans","Exo","Dancing Script","Monda","Gudea","Questrial","EB Garamond","Pathway Gothic One","Crete Round","Abril Fatface","Patua One","Josefin Slab","Istok Web","BenchNine","Architects Daughter","Source Code Pro","Covered By Your Grace","Gloria Hallelujah","Bangers","Amatic SC","Ropa Sans","News Cycle","Armata","Pontano Sans","Chewy","Righteous","Noticia Text","Quattrocento Sans","Kaushan Script","Old Standard TT","Cabin Condensed","ABeeZee","Sanchez","Hammersmith One","Lobster Two","Tinos","Cantarell","Courgette","Fredoka One","Ruda","Comfortaa","Archivo Black","Coming Soon","Sintony","Cinzel","Philosopher","Satisfy","Alfa Slab One","Kreon","Lateef","Rock Salt","Source Serif Pro","Didact Gothic","Russo One","Fauna One","Playball","Economica","Carrois Gothic","Cardo","Permanent Marker","Handlee","Tangerine","Nobile","Varela","Bevan","Paytone One","Antic Slab","Chivo","Quattrocento","Shadows Into Light Two","Special Elite","Amaranth","Signika Negative","Advent Pro","Cookie","Droid Sans Mono","Scada","Jura","Pinyon Script","Gentium Book Basic","Patrick Hand","Great Vibes","Changa One","Fugaz One","Marvel","Enriqueta","Molengo","Amiri","Voltaire","Playfair Display SC","Vidaloka","Marck Script","Actor","Luckiest Guy","Domine","Glegoo","Rambla","Just Another Hand","Sorts Mill Goudy","Niconne","Viga","Marmelad","Homenaje","Squada One","Audiowide","Calligraffitti","Damion","Cantata One","Basic","Doppio One","Neuton","Julius Sans One","Arapey","Days One","Lusitana","Cherry Cream Soda","Bad Script","Electrolize","Limelight","Montez","Coda","Ultra","Contrail One","Copse","Volkhov","Allerta","Syncopate","Carme","Acme","Homemade Apple","Nothing You Could Do","Waiting for the Sunrise","Berkshire Swash","Khula","Bubblegum Sans","Oleo Script","Cutive","Reenie Beanie","Walter Turncoat","Overlock","Jockey One","Nixie One","Michroma","Crafty Girls","Share","Kameron","Alice","Gentium Basic","Fontdiner Swanky","Montserrat Alternates","Yesteryear","Antic","Aldrich","Six Caps","Sacramento","Coustard","PT Serif Caption","Rochester","Telex","Neucha","Oranienbaum","Ubuntu Mono","Alegreya Sans SC","Cabin Sketch","Goudy Bookletter 1911","Aclonica","Trocchi","Boogaloo","Fredericka the Great","Sansita One","Spinnaker","Alex Brush","Quantico","Prata","Denk One","Average","Gochi Hand","Mako","Lilita One","Adamina","Rancho","Ceviche One","Allerta Stencil","Mallanna","Belleza","Rajdhani","Allura","Schoolbell","Radley","Freckle Face","Rosario","Frijole","Yellowtail","Puritan","Slackey","Inder","Allan","Hanuman","Magra","Port Lligat Slab","Arbutus Slab","Iceland","Black Ops One","Unica One","Fanwood Text","Press Start 2P","Racing Sans One","Forum","Cinzel Decorative","Marcellus","Parisienne","Tenor Sans","Alef","Alegreya SC","PT Mono","Metrophobic","Ek Mukta","Gilda Display","Marcellus SC","Duru Sans","Lustria","Gruppo","Graduate","Tauri","Knewave","Convergence","Chelsea Market","Capriola","Alike","Halant","Petit Formal Script","Average Sans","Voces","Kotta One","Baumans","Just Me Again Down Here","Finger Paint","Italianno","Unkempt","The Girl Next Door","Carter One","Nova Square","Grand Hotel","Cousine","Caudex","Fenix","IM Fell English","Caesar Dressing","Rufina","Leckerli One","Merienda","Roboto Mono","Londrina Solid","Annie Use Your Telescope","Belgrano","Kelly Slab","VT323","Crushed","Lily Script One","Sue Ellen Francisco","Judson","Timmana","IM Fell DW Pica","Anaheim","Imprima","Love Ya Like A Sister","Delius","Lemon","Simonetta","Sarala","Merienda One","Bentham","Corben","Rubik One","Andika","Ovo","Kalam","Work Sans","Give You Glory","Seaweed Script","Orienta","Brawler","Megrim","Lekton","Khand","Bowlby One","Shanti","Quando","Oxygen Mono","Poly","Strait","Gravitas One","Mr De Haviland","Monoton","GFS Didot","Pompiere","Happy Monkey","Salsa","Wire One","Kranky","Qwigley","Fjord One","Headland One","Tienne","Norican","La Belle Aurore","Khmer","Mystery Quest","Anonymous Pro","Teko","Slabo 13px","Titan One","Skranji","Zeyada","Creepster","Carrois Gothic SC","Trade Winds","Short Stack","Oregano","Averia Gruesa Libre","Englebert","Oleo Script Swash Caps","Amethysta","Loved by the King","Cedarville Cursive","Share Tech","Paprika","Gafata","Patrick Hand SC","Mountains of Christmas","Andada","Clicker Script","Prosto One","Expletus Sans","IM Fell English SC","Euphoria Script","Suwannaphum","UnifrakturMaguntia","Cambo","Kristi","Kite One","Cantora One","Federo","Engagement","Nova Mono","Uncial Antiqua","Shojumaru","Bowlby One SC","Podkova","Stardos Stencil","Arizonia","Stalemate","Meddon","Italiana","Griffy","Herr Von Muellerhoff","Poller One","Numans","Cambay","Buenard","Mate","Delius Swash Caps","Yeseva One","Ledger","Esteban","Over the Rainbow","Concert One","Biryani","Sniglet","Karma","Geo","Mate SC","Life Savers","Metamorphous","Gabriela","Vibur","Mouse Memoirs","Holtwood One SC","Dawning of a New Day","Mr Dafoe","Unna","Sofia","Ruslan Display","Averia Sans Libre","Prociono","IM Fell Double Pica","Cutive Mono","Rationale","Medula One","Dorsa","Margarine","Kavoon","IM Fell Great Primer","Aladin","Flamenco","Bilbo Swash Caps","Codystar","Stint Ultra Expanded","Krona One","Coda Caption","Sancreek","Vast Shadow","Averia Serif Libre","Monofett","Tulpen One","Chau Philomene One","Maiden Orange","Cherry Swash","Scheherazade","Henny Penny","Donegal One","Rye","IM Fell DW Pica SC","Junge","Amarante","Oldenburg","IM Fell French Canon","Fresca","Share Tech Mono","Wallpoet","Snowburst One","Martel","Poppins","Rouge Script","Cagliostro","Delius Unicase","Balthazar","Overlock SC","Londrina Outline","Condiment","Sunshiney","Artifika","Miltonian Tattoo","Romanesco","Raleway Dots","Inika","Bilbo","Galindo","MedievalSharp","Nova Round","Redressed","Stint Ultra Condensed","Nosifer","Rosarivo","McLaren","Habibi","Ruluko","Stoke","IM Fell Great Primer SC","Fondamento","Milonga","Ramabhadra","Aguafina Script","Gurajada","Jacques Francois","IM Fell French Canon SC","Pirata One","Miniver","Atomic Age","Keania One","Swanky and Moo Moo","Buda","Quintessential","UnifrakturCook","Text Me One","Battambang","Sonsie One","Port Lligat Sans","Sail","Snippet","League Script","Averia Libre","Bigshot One","Fira Mono","Dynalight","Angkor","Linden Hill","Spirax","Alike Angular","Nova Slim","Mandali","Julee","IM Fell Double Pica SC","Autour One","Offside","Asul","Iceberg","Sarina","Bokor","Butcherman","Rum Raisin","Antic Didone","Glass Antiqua","Mrs Saint Delafield","Della Respira","GFS Neohellenic","Palanquin","Irish Grover","Trykker","Kurale","Wendy One","Piedra","Rubik","Rammetto One","Kenia","Wellfleet","Sarpanch","Astloch","Ruthie","Trochut","New Rocker","Lovers Quarrel","Sofadi One","Warnes","Ribeye Marrow","Chango","Passero One","Joti One","Modern Antiqua","Nokora","Montserrat Subrayada","Nova Flat","Ribeye","Elsie","Peralta","Smythe","Germania One","Spicy Rice","Galdeano","Combo","Petrona","Ranchers","Elsie Swash Caps","Molle","Lancelot","Vampiro One","Montaga","Jolly Lodger","Geostar Fill","Palanquin Dark","Dangrek","Akronim","Monsieur La Doulaise","Odor Mean Chey","Bubbler One","Almendra","Miltonian","Eagle Lake","Yantramanav","Original Surfer","Asset","Siemreap","Erica One","Risque","Goblin One","Jacques Francois Shadow","Nova Cut","Smokum","Devonshire","Faster One","Croissant One","Nova Script","Kdam Thmor","Emilys Candy","Emblema One","Nova Oval","Koulen","Chicle","Miss Fajardose","Gorditas","Diplomata","Aubrey","Bonbon","Martel Sans","Diplomata SC","Metal Mania","Moulpali","Butterfly Kids","Moul","Purple Purse","Federant","Seymour One","Revalia","Mrs Sheppards","Geostar","Freehand","Londrina Sketch","Felipa","Supermercado One","Plaster","Kantumruy","Londrina Shadow","Eater","Underdog","Laila","Preahvihear","Marko One","Meie Script","Ewert","Macondo Swash Caps","Princess Sofia","Arbutus","Sirin Stencil","Suranna","Sevillana","Catamaran","Fascinate","Chonburi","Bigelow Rules","Vesper Libre","Metal","Ramaraja","Dr Sugiyama","Almendra SC","Flavors","Stalinist One","Rozha One","Mr Bedfort","Content","Chela One","Jim Nightshade","Taprom","Macondo","Jaldi","Ruge Boogie","Itim","Kadwa","NTR","Ranga","Bayon","Dekko","Amita","Chenla","Almendra Display","Rubik Mono One","Hanalei","Pragati Narrow","Sumana","Fascinate Inline","Tenali Ramakrishna","Gidugu","Sree Krushnadevaraya","Dhurjati","Fasthand","Unlock","Arya","Suravaram","Tillana","Fruktur","Lakki Reddy","Hanalei Fill","Inknut Antiqua","Peddana","Eczar","Asar","Rhodium Libre","Ravi Prakash","Modak","Sura","Sahitya"];

    BannerFlow.addEventListener(BannerFlow.INIT, function(){
        if(BannerFlow.editorMode)document.getElementById("no-value").style.display = "table-cell";
    })

    BannerFlow.addEventListener(BannerFlow.STYLE_CHANGED, function () {
        timerContainer.style.textShadow = BannerFlow.getStyle("textShadow");
        timerContainer.style.letterSpacing = BannerFlow.getStyle("letterSpacing");
    })

    BannerFlow.addEventListener(BannerFlow.SETTINGS_CHANGED, function(){
        for(var i=0;i<label.length;i++){
            label[i].style.color = BannerFlow.settings.labelColor;
            label[i].style.fontSize = BannerFlow.settings.labelSize+"px";
            if(!BannerFlow.settings.labels)
                label[i].style.display = "none";
            else
                label[i].style.display = ""
                }
        if(!BannerFlow.settings.delimiter) {
            for(var i=0;i<delimiter.length;i++)delimiter[i].innerHTML = "";
        }
        else{
            for(var i=0;i<delimiter.length;i++){
                if(BannerFlow.settings.delimimiter != null)delimiter[i].innerHTML = BannerFlow.settings.delimiter.substring("0","1");
                delimiter[i].style.color = BannerFlow.settings.timerColor;
                delimiter[i].style.fontSize = BannerFlow.settings.timerSize+"px";
            }
            delimiter[delimiter.length-1].style.display = "none";
        }
        for(var i=0;i<value.length;i++){
            value[i].style.fontSize = BannerFlow.settings.timerSize+"px";
            value[i].style.color = BannerFlow.settings.timerColor;
        }

        displayCount = 0;

        if(!BannerFlow.settings.days) document.getElementById("days").style.display = "none"; else document.getElementById("days").style.display = "table-cell";
        if(!BannerFlow.settings.hours) document.getElementById("hours").style.display = "none"; else document.getElementById("hours").style.display = "table-cell";
        if(!BannerFlow.settings.minutes) document.getElementById("minutes").style.display = "none"; else document.getElementById("minutes").style.display = "table-cell";
        if(!BannerFlow.settings.seconds) document.getElementById("seconds").style.display = "none"; else document.getElementById("seconds").style.display = "table-cell";
        if(!BannerFlow.settings.milliseconds) document.getElementById("milliseconds").style.display = "none"; else document.getElementById("milliseconds").style.display = "table-cell";


        for(var i = 0; i < timerContainer.children.length; i++) {
            if(timerContainer.children[i].style.display == "table-cell") displayCount++;
        }

        for(var i = 0; i < timerContainer.children.length; i++) {
            timerContainer.children[i].style.width =  (100 / Math.max(displayCount, 1)).toString() + '%';
        }

        var font = BannerFlow.settings.font;

        for(var key in fonts){
            if(fonts[key] == font)updateFont(font.replace(' ', '+'));
        }

        if(date) {
            CountDownTimer(date, 'countdown');
        }
    })

    BannerFlow.addEventListener(BannerFlow.TEXT_CHANGED, function () {
        if(BannerFlow.getText().length > 0 && BannerFlow.getText() !== "Enter text...") {
            CountDownTimer(BannerFlow.getText(), 'countdown');
            date = BannerFlow.getText();
            document.getElementById("no-value").style.display = "none"
            timerContainer.style.display = "table"
        }
        else {
            document.getElementById("no-value").innerHTML = "<p><strong>Countdown Timer</strong></p>Double-click and enter a date.";
            if(BannerFlow.editorMode)document.getElementById("no-value").style.display = "table-cell"
            timerContainer.style.display = "none"
        }
    });

    function CountDownTimer(date)
    {
        var end = new Date(date);
        var _second = 1000;
        var _minute = _second * 60;
        var _hour = _minute * 60;
        var _day = _hour * 24;
        var countUp = true;

        if(timer) clearInterval(timer);
        showRemaining();

        function showRemaining() {
            var now = new Date();
            var distance = end - now;
            var ahead = now.getTime() - end.getTime();
            var years;
            var days;
            var hours;
            var minutes;
            var seconds;
            var milliSeconds;
            if (distance < 0) {
                if(countUp || true){
                    days = Math.floor(ahead / _day);
                    hours = Math.floor((ahead % _day) / _hour);
                    minutes = Math.floor((ahead % _hour) / _minute);
                    seconds = Math.floor((ahead % _minute) / _second);
                    milliSeconds = Math.floor((ahead % _second) / 1);

                    if(days > 0){d.innerHTML = days + '';}
                    else{d.innerHTML = '';}
                    h.innerHTML = hours + '';
                    m.innerHTML = minutes + '';
                    s.innerHTML = seconds + '';
                    ms.innerHTML = milliSeconds + '';
                }
                else{
                    clearInterval(timer);
                    timerContainer.innerHTML = 'EXPIRED!';
                }
                return;
            }
            else{
                days = Math.floor(distance / _day);
                hours = Math.floor((distance % _day) / _hour);
                minutes = Math.floor((distance % _hour) / _minute);
                seconds = Math.floor((distance % _minute) / _second);
                milliSeconds = Math.floor((distance % _second) / 1);

                d.innerHTML = (days < 10) ? ('0'+days) : days;
                h.innerHTML = (hours < 10) ? ('0'+hours) : hours;
                m.innerHTML = (minutes < 10) ? ('0'+minutes) : minutes;
                s.innerHTML = (seconds < 10) ? ('0'+seconds) : seconds;
                ms.innerHTML = (milliSeconds < 100 ? '0' : '') + (milliSeconds < 10 ? '0' : '') + milliSeconds;
            }
        }
        timer = setInterval(showRemaining, BannerFlow.settings.milliseconds ? 35 : 1000);
    }
    function updateFont(font){
        var wf = document.createElement('style');
        var href = '@import url('+('https:' == document.location.protocol ? 'https' : 'http') + '://fonts.googleapis.com/css?family='+font+');';
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = href;
        } else {
            style.appendChild(document.createTextNode(href));
        }
        head.appendChild(style);
        document.getElementsByTagName("body")[0].style.fontFamily = font+', sans-serif';
    }
}
