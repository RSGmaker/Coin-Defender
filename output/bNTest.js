Bridge.assembly("CoinDefender", function ($asm, globals) {
    "use strict";

    /** @namespace System */

    /**
     * @memberof System
     * @callback System.Action
     * @param   {string}    arg
     * @return  {void}
     */

    Bridge.define("BNTest.GameMode", {
        statics: {
            teamBattle: null,
            deathMatch: null,
            gameModes: null,
            config: {
                init: function () {
                    Bridge.ready(this.init);
                }
            },
            getGameModesOfType: function (type) {
                return new (System.Collections.Generic.List$1(BNTest.GameMode))(System.Linq.Enumerable.from(BNTest.GameMode.gameModes).where(function (G) {
                    return G.getModeType() === type;
                }));
            },
            getGameModeByName: function (name) {
                var ret = new (System.Collections.Generic.List$1(BNTest.GameMode))(System.Linq.Enumerable.from(BNTest.GameMode.gameModes).where(function (G) {
                    return Bridge.referenceEquals(G.getName(), name);
                }));
                if (ret.getCount() > 0) {
                    return ret.getItem(0);
                }
                return null;
            },
            init: function () {
                if (BNTest.GameMode.teamBattle == null) {
                    BNTest.GameMode.gameModes = new (System.Collections.Generic.List$1(BNTest.GameMode))();
                    BNTest.GameMode.teamBattle = new BNTest.GameMode("Team Battle");
                    BNTest.GameMode.teamBattle.setDescription("2 teams battle with limited lives\nuntil only 1 team remains.");
                    BNTest.GameMode.deathMatch = new BNTest.GameMode("Death Match");
                    BNTest.GameMode.deathMatch.setDescription("A free for all match with\nlimited lives.");
                    BNTest.GameMode.deathMatch.setTeams(false);
                }
            }
        },
        $entryPoint: true,
        config: {
            properties: {
                Teams: false,
                StartingLives: 0,
                Survival: false,
                AllowOnlinePlay: false,
                AllowCharacterSelect: false,
                NumberOfPlayers: 0,
                RespawnTime: 0,
                Name: null,
                ModeType: 0,
                unlocked: false,
                Description: null
            }
        },
        ctor: function (name) {
            this.$initialize();
            this.setTeams(true);
            this.setStartingLives(3);
            this.setSurvival(true);
            this.setAllowOnlinePlay(true);
            this.setAllowCharacterSelect(true);
            this.setNumberOfPlayers(6);
            this.setRespawnTime(390);
            this.setName(name);
            this.setModeType(BNTest.GameMode.ModeTypes.Skirmish);
            this.setDescription(System.String.concat("Missing description for ", name));
            this.setunlocked(true);
            BNTest.GameMode.gameModes.add(this);
        }
    });

    Bridge.define("BNTest.EntityBehavior", {
        enabled: true,
        framesPerTick: 0,
        entity: null,
        config: {
            properties: {
                BehaviorName: null
            }
        },
        ctor: function (entity) {
            this.$initialize();
            this.entity = entity;
            if (Bridge.referenceEquals(this.getBehaviorName(), "") || this.getBehaviorName() == null) {
                var test = Bridge.getType(this);
                var s = Bridge.Reflection.getTypeFullName(Bridge.getType(this)).split(".");
                this.setBehaviorName(s[((s.length - 1) | 0)]);
                //BehaviorName = GetType().FullName;
                //GetType().GetClassName

            }
        },
        update: function () {

        },
        draw: function (gl) {
        },
        sendCustomEvent: function (evt, triggerflush) {
            if (triggerflush === void 0) { triggerflush = false; }
            var D = {  };
            D.I = this.entity.ID;
            D.D = evt;
            //D.T = this.GetType().FullName;
            D.T = this.getBehaviorName();
            this.entity.game.sendEvent("CBE", D, triggerflush);
        },
        customEvent: function (evt) {

        }
    });

    Bridge.define("BNTest.AnimationLoader", {
        statics: {
            directory: "",
            _throttleRequests: false,
            spritesheetdata: "[{\"name\":\"Sakuya_Blink0\",\"x\":1122,\"y\":645,\"width\":96,\"height\":128},{\"name\":\"Sakuya_Idle0\",\"x\":1122,\"y\":516,\"width\":96,\"height\":128},{\"name\":\"Sakuya_Jump0\",\"x\":388,\"y\":1048,\"width\":96,\"height\":128},{\"name\":\"Sakuya_Walk0\",\"x\":194,\"y\":1048,\"width\":96,\"height\":128},{\"name\":\"Sakuya_Walk1\",\"x\":97,\"y\":1048,\"width\":96,\"height\":128},{\"name\":\"Sakuya_Walk2\",\"x\":0,\"y\":1048,\"width\":96,\"height\":128},{\"name\":\"Sakuya_Walk3\",\"x\":1025,\"y\":903,\"width\":96,\"height\":128},{\"name\":\"SakuyaArm0\",\"x\":1122,\"y\":1065,\"width\":16,\"height\":81},{\"name\":\"Sakuyabullet0\",\"x\":1067,\"y\":1146,\"width\":40,\"height\":20},{\"name\":\"Starbullet0\",\"x\":945,\"y\":855,\"width\":32,\"height\":32},{\"name\":\"Tile0\",\"x\":1122,\"y\":872,\"width\":48,\"height\":48},{\"name\":\"Tile1\",\"x\":1067,\"y\":1048,\"width\":48,\"height\":48},{\"name\":\"Tile2\",\"x\":1122,\"y\":774,\"width\":48,\"height\":48},{\"name\":\"Tile3\",\"x\":1122,\"y\":823,\"width\":48,\"height\":48},{\"name\":\"Tile4\",\"x\":970,\"y\":919,\"width\":48,\"height\":48},{\"name\":\"Tile5\",\"x\":970,\"y\":968,\"width\":48,\"height\":48},{\"name\":\"Tile6\",\"x\":1067,\"y\":1097,\"width\":48,\"height\":48},{\"name\":\"Tombstone0\",\"x\":940,\"y\":790,\"width\":48,\"height\":64},{\"name\":\"Yinyangorb0\",\"x\":875,\"y\":790,\"width\":64,\"height\":64},{\"name\":\"Cirno_Blink0\",\"x\":873,\"y\":919,\"width\":96,\"height\":128},{\"name\":\"Cirno_Idle0\",\"x\":1025,\"y\":0,\"width\":96,\"height\":128},{\"name\":\"Cirno_Jump0\",\"x\":1025,\"y\":129,\"width\":96,\"height\":128},{\"name\":\"Cirno_Walk0\",\"x\":1025,\"y\":258,\"width\":96,\"height\":128},{\"name\":\"Cirno_Walk1\",\"x\":1025,\"y\":387,\"width\":96,\"height\":128},{\"name\":\"Cirno_Walk2\",\"x\":1025,\"y\":516,\"width\":96,\"height\":128},{\"name\":\"Cirno_Walk3\",\"x\":1025,\"y\":645,\"width\":96,\"height\":128},{\"name\":\"CirnoArm0\",\"x\":1122,\"y\":921,\"width\":16,\"height\":61},{\"name\":\"Flame0\",\"x\":516,\"y\":790,\"width\":128,\"height\":128},{\"name\":\"Flame1\",\"x\":387,\"y\":790,\"width\":128,\"height\":128},{\"name\":\"Flame2\",\"x\":258,\"y\":790,\"width\":128,\"height\":128},{\"name\":\"Flame3\",\"x\":129,\"y\":790,\"width\":128,\"height\":128},{\"name\":\"Flame4\",\"x\":645,\"y\":790,\"width\":128,\"height\":128},{\"name\":\"Flame5\",\"x\":0,\"y\":790,\"width\":128,\"height\":128},{\"name\":\"LFairy2\",\"x\":875,\"y\":855,\"width\":36,\"height\":34},{\"name\":\"Light0\",\"x\":774,\"y\":790,\"width\":100,\"height\":100},{\"name\":\"Lightorbbullet\",\"x\":912,\"y\":855,\"width\":32,\"height\":32},{\"name\":\"Marisa_Blink0\",\"x\":776,\"y\":1048,\"width\":96,\"height\":128},{\"name\":\"Marisa_Idle0\",\"x\":873,\"y\":1048,\"width\":96,\"height\":128},{\"name\":\"Marisa_Jump0\",\"x\":970,\"y\":1048,\"width\":96,\"height\":128},{\"name\":\"Marisa_Walk0\",\"x\":1122,\"y\":0,\"width\":96,\"height\":128},{\"name\":\"Marisa_Walk1\",\"x\":1122,\"y\":129,\"width\":96,\"height\":128},{\"name\":\"Marisa_Walk2\",\"x\":1122,\"y\":258,\"width\":96,\"height\":128},{\"name\":\"Marisa_Walk3\",\"x\":582,\"y\":1048,\"width\":96,\"height\":128},{\"name\":\"MarisaArm0\",\"x\":1006,\"y\":790,\"width\":16,\"height\":61},{\"name\":\"Marisabullet0\",\"x\":0,\"y\":769,\"width\":200,\"height\":20},{\"name\":\"Reimu_Blink0\",\"x\":679,\"y\":919,\"width\":96,\"height\":128},{\"name\":\"Reimu_Idle0\",\"x\":582,\"y\":919,\"width\":96,\"height\":128},{\"name\":\"Reimu_Jump0\",\"x\":485,\"y\":919,\"width\":96,\"height\":128},{\"name\":\"Reimu_Walk0\",\"x\":388,\"y\":919,\"width\":96,\"height\":128},{\"name\":\"Reimu_Walk1\",\"x\":291,\"y\":919,\"width\":96,\"height\":128},{\"name\":\"Reimu_Walk2\",\"x\":194,\"y\":919,\"width\":96,\"height\":128},{\"name\":\"Reimu_Walk3\",\"x\":97,\"y\":919,\"width\":96,\"height\":128},{\"name\":\"ReimuArm0\",\"x\":1122,\"y\":983,\"width\":16,\"height\":81},{\"name\":\"Reisen_Blink0\",\"x\":0,\"y\":919,\"width\":96,\"height\":128},{\"name\":\"Reisen_Idle0\",\"x\":1122,\"y\":387,\"width\":96,\"height\":128},{\"name\":\"Reisen_Jump0\",\"x\":776,\"y\":919,\"width\":96,\"height\":128},{\"name\":\"Reisen_Walk0\",\"x\":679,\"y\":1048,\"width\":96,\"height\":128},{\"name\":\"Reisen_Walk1\",\"x\":485,\"y\":1048,\"width\":96,\"height\":128},{\"name\":\"Reisen_Walk2\",\"x\":1025,\"y\":774,\"width\":96,\"height\":128},{\"name\":\"Reisen_Walk3\",\"x\":291,\"y\":1048,\"width\":96,\"height\":128},{\"name\":\"ReisenArm0\",\"x\":989,\"y\":790,\"width\":16,\"height\":61},{\"name\":\"Reisenbullet0\",\"x\":970,\"y\":1017,\"width\":32,\"height\":20},{\"name\":\"BG0\",\"x\":0,\"y\":0,\"width\":1024,\"height\":768}]",
            __this: null,
            get_this: function () {
                if (BNTest.AnimationLoader.__this == null) {
                    BNTest.AnimationLoader.__this = new BNTest.AnimationLoader();
                }
                return BNTest.AnimationLoader.__this;
            },
            init: function () {
                if (BNTest.AnimationLoader.__this == null) {
                    BNTest.AnimationLoader.__this = new BNTest.AnimationLoader();
                }
            },
            getPixels: function (image) {
                var tmp = document.createElement('canvas');
                tmp.width = image.width;
                tmp.height = image.height;
                var g = BNTest.Helper.getContext(tmp);
                g.drawImage(image, 0, 0);

                return g.getImageData(0, 0, tmp.width, tmp.height).data;
            },
            flipImage: function (I) {
                var outer = document.createElement('canvas');
                var C = document.createElement('canvas');
                var g = C.getContext("2d");
                g.scale(-1, 1);
                g.drawImage(I, I.width, 0.0);

                g = outer.getContext("2d");
                g.drawImage(C, 0.0, 0.0);
                var ID = g.getImageData(0, 0, I.width, I.height);
                var ret = new Image();
                ret.src = g.canvas.toDataURL();
                return ret;
            },
            preLoad: function (paths) {
                BNTest.HelperExtensions.forEach(String, paths, $_.BNTest.AnimationLoader.f1);
                //return __this.GetAnimation(path);
            },
            get: function (path) {
                return BNTest.AnimationLoader.__this.getAnimation(path);
            }
        },
        zip: null,
        zipPath: "",
        baseZipPath: "",
        _data: null,
        _callbacks: null,
        _loading: null,
        spritesheet: null,
        spritesheetimage: null,
        queued: null,
        ready: false,
        ctor: function () {
            this.$initialize();
            this._data = new (System.Collections.Generic.Dictionary$2(String,System.Collections.Generic.List$1(HTMLImageElement)))();
            this._loading = new (System.Collections.Generic.List$1(String))();

            this.queued = new (System.Collections.Generic.List$1(String))();
            //_callbacks = new Dictionary<string, Action<string>>();
            this._callbacks = new (System.Collections.Generic.Dictionary$2(String,System.Collections.Generic.List$1(Function)))();

            return;
            this.spritesheet = JSON.parse(BNTest.AnimationLoader.spritesheetdata);
            //spritesheet = spritesheet.ToDynamic().frames;
            if (this.spritesheetimage == null) {
                var self = this;
                this.spritesheetimage = new Image();
                this.spritesheetimage.src = System.String.concat(BNTest.AnimationLoader.directory, "spritesheet.png");
                //spritesheetimage.OnLoad = (I => self.ready = true);
                this.spritesheetimage.onload = (function (I) {
                    self.onReady();
                });
            }
        },
        queueEmpty: function () {
            return this._loading.getCount() === 0;
        },
        queueSize: function () {
            return this._loading.getCount();
        },
        onReady: function () {
            this.ready = true;
            BNTest.HelperExtensions.forEach(String, this.queued.toArray(), Bridge.fn.bind(this, $_.BNTest.AnimationLoader.f2));
        },
        downloadFile: function (path, responseType) {
            if (responseType === void 0) { responseType = 2; }
            var X = new XMLHttpRequest();
            X.responseType = responseType;
            X.open("GET", path, false);
            if (X.status === 200 || X.status === 304) {
                return X;
            }
            return null;
        },
        _LoadAnimation: function (list, path, img) {
            if (img === void 0) { img = null; }
            if (img != null) {
                if (img.width > 0) {
                    /* if (flip)
                        {
                            img = FlipImage(img);
                        }*/
                    //Console.WriteLine("loaded:"+path + (index - 1) + ".png");
                    list.add(img);
                } else {
                    //Console.WriteLine("failed:" + path + (index - 1) + ".png");
                    return;
                }
            }
            //var callback = Script.Write<object>("this._LoadAnimation");
            var I = new Image();

            var self = BNTest.AnimationLoader.get_this();
            //Script.Write("I.onload = function() {self._LoadAnimation(list,path,index+1,_recursion,_error,I);}");
            I.onload = function() {self._LoadAnimation(list,path,I);};
            I.onerror = function() {self._Finish(path);};
            //Script.Write("I.onload = function() {_recursion(list,path,index+1,_recursion,_error,I);}");
            //Script.Write("I.onerror = function() {_error(path);}");
            var index = list.getCount();
            var file = System.String.concat(System.String.concat(System.String.concat(path, "_"), index), ".png");
            //Console.WriteLine("Now loading:" + file);
            console.log(System.String.concat("Now loading:", file));
            I.src = file;
        },
        isLoading: function (path) {
            path = System.String.concat(BNTest.AnimationLoader.directory, path);
            return this._loading.contains(path);
        },
        isIdle: function () {
            return this._loading.getCount() <= 0 && this.queued.getCount() <= 0;
        },
        _Finish: function (path) {
            var self = BNTest.AnimationLoader.get_this();
            var L = self._loading;

            if (L.contains(path)) {
                //Console.WriteLine("finish:" + path);
                if (this._data.get(path).getCount() > 0) {
                    console.log(System.String.concat("finish:", path));
                } else {
                    console.log(System.String.concat("Could not load:", path));
                }

                L.remove(path);
            } else {
                console.log(System.String.concat("Could not load:", path));
            }
            if (BNTest.AnimationLoader._throttleRequests && L.getCount() > 0) {
                //Console.WriteLine("Now resuming:" + L[0]);
                console.log(System.String.concat("Now resuming:", L.getItem(0)));
                //Global.SetTimeout(() => self._LoadAnimation(self._data[L[0]], L[0], 0, Script.Write<object>("self._LoadAnimation"), Script.Write<object>("self._Finish")/*,flip*/),1);
                Bridge.global.setTimeout(function () {
                    self._LoadAnimation(self._data.get(L.getItem(0)), L.getItem(0));
                });
            }

            //Action<string> A = self._callbacks[path];
            if (self._callbacks.containsKey(path)) {
                var A = self._callbacks.get(path);
                if (A != null) {
                    /* int i = 0;
                        while (i < A.Count)
                        {
                            A[i](path);
                            i++;
                        }*/
                    BNTest.HelperExtensions.forEach(Function, A, function (C) {
                        C(path);
                    });
                    /* A(path);
                        self._callbacks[path] = null;*/
                }
            }
        },
        /**
         * Calls Get() and sets a callback for when it finishes.
         *
         * @instance
         * @public
         * @this BNTest.AnimationLoader
         * @memberof BNTest.AnimationLoader
         * @param   {string}           path                          
         * @param   {System.Action}    callback                      
         * @param   {boolean}          callImmediatelyIfAvailable    if the data is already loaded, and this is set to true, executes the callback anyway.
         * @return  {boolean}                                        Returns true if started, false if the asset was already available.
         */
        asyncGet: function (path, callback, callImmediatelyIfAvailable) {
            if (callImmediatelyIfAvailable === void 0) { callImmediatelyIfAvailable = false; }
            var R = BNTest.AnimationLoader.get(path);
            var P = System.String.concat(BNTest.AnimationLoader.directory, path);
            if (R == null || R.getCount() <= 0) {

                var L;
                if (!this._callbacks.containsKey(P)) {
                    L = new (System.Collections.Generic.List$1(Function))();
                    this._callbacks.set(P, L);
                } else {
                    L = this._callbacks.get(P);
                }
                L.add(callback);
                //this._callbacks[path] = callback;
                return true;
            } else if (callImmediatelyIfAvailable) {
                callback(P);
            }
            return false;
        },
        asyncGet$1: function (paths, callback) {
            var total = paths.length;
            var i = 0;
            while (i < paths.length) {
                (function () {
                    this.asyncGet(paths[i], function (s) {
                        total = (total - 1) | 0;
                        if (total === 0) {
                            callback();
                        }
                    }, true);
                    //AsyncGet(paths[i], s => { total--;P.RemoveAt(0); if (P.Count==0) { callback(); } }, true);
                    /* if (i < paths.Count - 1)
                    {
                        Get(paths[i]);
                    }
                    else
                    {
                        AsyncGet(paths[i], s => { callback(); }, true);
                    }*/
                    i = (i + 1) | 0;
                }).call(this);
            }
            return total > 0;
        },
        _GetAnimation: function (L, path) {
            //List<ImageElement> L = new List<ImageElement>();

            /* int index = 0;
                XMLHttpRequest X = null;
                do
                {
                    X = DownloadFile(path + index + ".png");
                    if (X != null)
                    {
                        ImageElement I = new ImageElement();
                        I.Src = Script.Write<string>("window.URL.createObjectURL(X.response)");
                        L.Add(I);
                    }
                } while (X != null);
                if (L.Count == 0)
                {
                    X = DownloadFile(path + ".png");
                    if (X != null)
                    {
                        ImageElement I = new ImageElement();
                        I.Src = Script.Write<string>("window.URL.createObjectURL(X.response)");
                        L.Add(I);
                    }
                }*/
            var flip = false;
            var loc = path;
            if (path.lastIndexOf(String.fromCharCode(70)) === ((path.length - 1) | 0)) {
                flip = true;
                loc = System.String.remove(loc, ((path.length - 1) | 0));
            }
            if (!BNTest.AnimationLoader._throttleRequests || this._loading.getCount() <= 0) {
                //Console.WriteLine("Starting:" + loc);
                console.log(System.String.concat("Starting:", loc));
                //_LoadAnimation(L, loc, 0, Script.Write<object>("this._LoadAnimation"), Script.Write<object>("this._Finish")/*,flip*/);
                var self = BNTest.AnimationLoader.get_this();
                Bridge.global.setTimeout(function () {
                    self._LoadAnimation(L, loc);
                });
            } else if (BNTest.AnimationLoader._throttleRequests) {
                //Console.WriteLine("adding to queue:" + loc);
                console.log(System.String.concat("adding to queue:", loc));
            }
            this._loading.add(path);
            //return L;
        },
        _GetAnimationFromSpriteSheet: function (path) {
            if (!this.ready) {
                if (!this.queued.contains(path)) {
                    this.queued.add(path);
                }
                return;
            }
            //Console.WriteLine("loading from spritesheet:" + path);
            console.log(System.String.concat("loading from spritesheet:", path));
            var L = this._data.get(path);
            var frames = this.spritesheet;
            var i = 0;
            var tmp = document.createElement('canvas');
            var g = BNTest.Helper.getContext(tmp);
            while (i < frames.length) {
                var frame = frames[i];
                //string p = Directory + frame.filename;
                var p = System.String.concat(BNTest.AnimationLoader.directory, frame.name);
                if (System.String.startsWith(p, path)) {
                    //dynamic rect = frame.spriteSourceSize;
                    //dynamic rect = frame.frame;
                    var rect = frame;
                    //tmp.Width = rect.w;
                    //tmp.Height = rect.h;
                    tmp.width = rect.width;
                    tmp.height = rect.height;
                    g.drawImage(this.spritesheetimage, -rect.x, -rect.y);
                    L.add(tmp);
                    //Console.WriteLine("added from spritesheet:" + p);
                    console.log(System.String.concat("added from spritesheet:", p));
                    tmp = document.createElement('canvas');
                    g = BNTest.Helper.getContext(tmp);
                }
                i = (i + 1) | 0;
            }
            //Console.WriteLine("finished loading from spritesheet:" + path);
            console.log(System.String.concat("finished loading from spritesheet:", path));
            if (this.queued.contains(path)) {
                this.queued.remove(path);
            }
        },
        loadAnimationFromZip: function (path) {
            var ret = new (System.Collections.Generic.List$1(HTMLImageElement))();
            try {
                var P = path;
                if (System.String.indexOf(P, this.baseZipPath) === 0) {
                    P = P.substr(((this.baseZipPath.length + 1) | 0));
                }
                var f = System.String.concat(System.String.concat(this.zipPath, "://"), P);
                var i = 0;
                while (true) {
                    var ipath = System.String.concat(System.String.concat(System.String.concat(f, "_"), i), ".png");
                    var img = this.zip.loadImage(ipath);

                    var N = new Image();
                    N.src = img;
                    ret.add(N);
                    i = (i + 1) | 0;
                }
            }
            catch ($e1) {
                $e1 = System.Exception.create($e1);

            }
            if (ret.getCount() > 0) {
                console.log(System.String.concat(System.String.concat("Loaded animation \"", path), "\" from zip file."));
                return ret;
            }
            return null;
        },
        setZip: function (zipPath) {
            this.zipPath = zipPath;
            this.baseZipPath = System.String.replaceAll(zipPath, ".zip", "");
            this.zip = new ZipLoader(zipPath);
        },
        getAnimation: function (path) {
            path = System.String.concat(BNTest.AnimationLoader.directory, path);
            if (this._data.containsKey(path)) {
                return this._data.get(path);
            } else {
                //_loading.Add(path);
                if (this.zip != null) {
                    var R = this.loadAnimationFromZip(path);
                    if (R != null) {
                        this._data.set(path, R);
                        return R;
                    }
                }
                var L = new (System.Collections.Generic.List$1(HTMLImageElement))();
                this._data.set(path, L);
                this._GetAnimation(L, path);
                //_GetAnimationFromSpriteSheet(path);
                return L;
            }
        }
    });

    var $_ = {};

    Bridge.ns("BNTest.AnimationLoader", $_);

    Bridge.apply($_.BNTest.AnimationLoader, {
        f1: function (path) {
            BNTest.AnimationLoader.__this.getAnimation(path);
        },
        f2: function (Q) {
            this._GetAnimationFromSpriteSheet(Q);
        }
    });

    Bridge.define("BNTest.App", {
        statics: {
            div: null,
            canvas: null,
            guiCanvas: null,
            gui: null,
            targetAspect: 0,
            screenBounds: null,
            _lSize: -1,
            _lHeight: -1,
            gameName: "Coin Defender",
            gameVersion: "0.4",
            IC: null,
            DEBUG: false,
            update: function () {
                BNTest.KeyboardManager.update();
                BNTest.App.updateWindow();
            },
            updateWindow: function () {
                //var R = Window.InnerWidth / Window.InnerHeight;
                var H = window.innerHeight;
                var size = Math.ceil(H * (1 / BNTest.App.targetAspect));
                //if (size != _lSize)
                if (H !== BNTest.App._lHeight) {
                    /* Canvas.Style.Width = size + "px";

                    Canvas.Style.Position = Position.Absolute;
                    Canvas.Style.Left = ((Window.InnerWidth / 2) - (size / 2)) + "px";*/
                    BNTest.App.canvas.style.width = "100%";
                    BNTest.App.guiCanvas.style.width = "100%";
                    BNTest.App.div.style.width = System.String.concat(System.Double.format(size, 'G'), "px");

                    //Div.Style.Position = Position.Absolute;
                    BNTest.App.div.style.position = "relative";
                    BNTest.App.div.style.left = System.String.concat(System.Double.format(((((Bridge.Int.div(window.innerWidth, 2)) | 0)) - (size / 2)), 'G'), "px");
                    //_lSize = size;
                    BNTest.App._lHeight = H;
                }
            },
            initCube: function (canvas) {
                var cube = new BNTest.Cube();

                BNTest.App.initSettings(cube);

                cube.canvas = canvas;
                cube.gl = BNTest.App.create3DContext(cube.canvas);

                if (cube.gl != null) {
                    cube.initShaders();
                    cube.initBuffers();
                    cube.initTexture();
                    cube.tick();

                    document.addEventListener("keydown", Bridge.fn.bind(cube, cube.handleKeyDown));
                    document.addEventListener("keyup", Bridge.fn.bind(cube, cube.handleKeyUp));
                } else {
                    BNTest.App.showError(cube.canvas, "<b>Either the browser doesn't support WebGL or it is disabled.<br>Please follow <a href=\"http://get.webgl.com\">Get WebGL</a>.</b>");
                }
            },
            showError: function (canvas, message) {
                canvas.parentElement.replaceChild(Bridge.merge(document.createElement('p'), {
                    innerHTML: message
                } ), canvas);
            },
            initSettings: function (cube) {
                var useSettings = document.getElementById("settings");

                if (useSettings == null || !useSettings.checked) {
                    return;
                }

                cube.useBlending = document.getElementById("blending").checked;
                cube.alpha = parseFloat(document.getElementById("alpha").value);

                cube.useLighting = document.getElementById("lighting").checked;

                cube.ambientR = parseFloat(document.getElementById("ambientR").value);
                cube.ambientG = parseFloat(document.getElementById("ambientG").value);
                cube.ambientB = parseFloat(document.getElementById("ambientB").value);

                cube.lightDirectionX = parseFloat(document.getElementById("lightDirectionX").value);
                cube.lightDirectionY = parseFloat(document.getElementById("lightDirectionY").value);
                cube.lightDirectionZ = parseFloat(document.getElementById("lightDirectionZ").value);

                cube.directionalR = parseFloat(document.getElementById("directionalR").value);
                cube.directionalG = parseFloat(document.getElementById("directionalG").value);
                cube.directionalB = parseFloat(document.getElementById("directionalB").value);

                cube.textureImageSrc = "crate.gif";
            },
            create3DContext: function (canvas) {
                var $t;
                var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];

                var context = null;

                $t = Bridge.getEnumerator(names);
                while ($t.moveNext()) {
                    var name = $t.getCurrent();
                    try {
                        context = canvas.getContext(name);
                    }
                    catch ($e1) {
                        $e1 = System.Exception.create($e1);
                    }

                    if (context != null) {
                        break;
                    }
                }

                return context;
            }
        },
        $main: function () {
            // Create a new Button
            var button = Bridge.merge(document.createElement('button'), {
                innerHTML: "Click Me",
                onclick: $_.BNTest.App.f1
            } );
            document.body.style.cssText = "overflow: hidden;margin: 0;padding: 0;";
            // Add the Button to the page
            //Document.Body.AppendChild(button);



            /* var canvas = new HTMLCanvasElement
                {
                    Width = 1280,
                    Height = 960
                };*/
            document.title = System.String.concat(System.String.concat(System.String.concat(BNTest.App.gameName, " "), BNTest.App.gameVersion), " by:RSGmaker");

            BNTest.WGMatrix.init();
            BNTest.App.IC = new BNTest.InputController("KeyboardMouse");
            BNTest.App.div = document.createElement('div');
            var Canv = document.createElement('canvas');
            BNTest.App.canvas = Canv;
            BNTest.App.targetAspect = 0.75;
            Canv.width = 1024;
            //Canv.Width = 1280;
            Canv.height = Bridge.Int.clip32(Canv.width * BNTest.App.targetAspect);
            BNTest.App.screenBounds = new BNTest.Rectangle(0, 0, Canv.width, Canv.height);

            BNTest.App.div.appendChild(Canv);
            document.body.appendChild(BNTest.App.div);
            BNTest.App.guiCanvas = document.createElement('canvas');
            BNTest.App.guiCanvas.width = Canv.width;
            BNTest.App.guiCanvas.height = Canv.height;
            BNTest.App.guiCanvas.style.position = "absolute";
            BNTest.App.guiCanvas.style.left = "0px";
            BNTest.App.guiCanvas.style.top = "0px";

            //guiCanvas.Style.Opacity = "0.85";
            BNTest.App.gui = BNTest.Helper.getContext(BNTest.App.guiCanvas);
            BNTest.App.div.appendChild(BNTest.App.guiCanvas);

            /* gui.FillStyle = "#FF0000";
                gui.GlobalAlpha = 0.3f;
                gui.FillRect(0, 0, 1024, 1024);*/

            //Canvas = canvas;
            //Document.Body.AppendChild(canvas);
            BNTest.KeyboardManager.init();
            var GD = new BNTest.GLDemo();
            GD.start(BNTest.App.canvas);
            //AnimationLoader._this.AsyncGet("Asset/rahmoo", s => new GLDemo().Start(Canvas));

            var smooth = true;
            /* Document.Body.OnKeyDown = K =>
                {
                    KeyboardEvent KE = K.As<KeyboardEvent>();
                    if (KE.KeyCode == KeyboardEvent.DOM_VK_S)
                    {
                        Mesh mesh = new Mesh(GD);
                        VoxelMap VM = VoxelMap.FromImages(AnimationLoader.Get("Assets/rahmoo"));
                        mesh.AddVoxelMap(VM, smooth = !smooth);
                        GD.mesh = mesh;
                    }
                };*/
            //InitCube(canvas);
            //WebGLRenderingContext gl = Create3DContext(canvas);

            //Bridge.WebGL.WebGLRenderingContext = new Bridge.WebGL.WebGLRenderingContext()

            // To confirm Bridge.NET is working: 
            // 1. Build this project (Ctrl + Shift + B)
            // 2. Browse to file /Bridge/www/demo.html
            // 3. Right-click on file and select "View in Browser" (Ctrl + Shift + W)
            // 4. File should open in a browser, click the "Submit" button
            // 5. Success!
        }
    });

    Bridge.ns("BNTest.App", $_);

    Bridge.apply($_.BNTest.App, {
        f1: function (ev) {
            // When Button is clicked, 
            // the Bridge Console should open.
            Bridge.Console.log("Success!");
        }
    });

    Bridge.define("BNTest.Audio", {
        _AM: null,
        _audio: null,
        _hasPlayed: false,
        _blast: null,
        _loop: false,
        onPlay: null,
        onStop: null,
        lasttime: 0,
        config: {
            properties: {
                ID: null
            }
        },
        ctor: function (audio, ID, AudioManager) {
            this.$initialize();
            this._audio = audio;
            this.setID(ID);
            var self = this;
            this._AM = AudioManager;
            //object A = (() => self._OnPlay);
            //Action A = new Action(() => self._OnPlay());

            /* _audio.OnPlay = new Action(() => self._OnPlay()).ToDynamic();
                _audio.OnPause = new Action(() => self._OnStop()).ToDynamic();
                //_audio.OnEnded = new Action(() => self._OnStop()).ToDynamic();
                _audio.OnEnded = new Action(() => self._OnEnd()).ToDynamic();
                _audio.OnTimeUpdate = new Action(() => self._OnUpdate()).ToDynamic();*/
            this.setAudio();

            this._blast = new (System.Collections.Generic.List$1(HTMLAudioElement))();
            var maxvoices = 6;
            var voices = 1;
            while (voices < maxvoices) {
                this._blast.add(Bridge.cast(this._audio.cloneNode(), HTMLAudioElement));
                voices = (voices + 1) | 0;
            }
            /* _blast.Add((AudioElement)_audio.CloneNode());
                _blast.Add((AudioElement)_audio.CloneNode());
                _blast.Add((AudioElement)_audio.CloneNode());
                _blast.Add((AudioElement)_audio.CloneNode());*/
            /* _audio.OnPlay = "self._OnPlay()".ToDynamic();
                _audio.OnPause = "self._OnStop()".ToDynamic();
                _audio.OnEnded = "self._OnStop()".ToDynamic();*/
        },
        getIsPlaying: function () {
            return !(!this._hasPlayed || this._audio.paused || this._audio.currentTime === 0.0);
        },
        setIsPlaying: function (value) {
            if (value) {
                this.play();
            } else {
                this.pause();
            }
        },
        getLoop: function () {
            //return _audio.Loop;
            return this._loop;
        },
        setLoop: function (value) {
            //_audio.Loop = value;
            this._loop = value;
            //_audio.Loop = value;
        },
        getCurrentTime: function () {
            return this._audio.currentTime;
        },
        setCurrentTime: function (value) {
            this._audio.currentTime = value;
        },
        getVolume: function () {
            return this._audio.volume;
        },
        setVolume: function (value) {
            this._audio.volume = value;
        },
        play: function () {
            if (!this.getIsPlaying()) {
                this.lasttime = this.getCurrentTime();
                /* double V = Volume;
                    _audio = new HTMLAudioElement(ID);
                    _audio.Volume = V;*/
                this._audio.play();
                this._hasPlayed = true;
                /* setAudio();*/
                return true;
            }
            return false;
        },
        pause: function () {
            if (this.getIsPlaying()) {
                this._audio.pause();
                return true;
            }
            return false;
        },
        stop: function () {
            if (this.getIsPlaying()) {
                this._audio.pause();
                this._audio.currentTime = 0;
                return true;
            }
            return false;
        },
        setAudio: function () {
            var self = this;

            this._audio.onplay = function () {
                self._OnPlay();
            };
            this._audio.onpause = function () {
                self._OnStop();
            };
            this._audio.onended = function () {
                self._OnEnd();
            };
            this._audio.ontimeupdate = function () {
                self._OnUpdate();
            };
        },
        blast: function (volume) {
            if (volume === void 0) { volume = 1.0; }
            if (!this.getIsPlaying()) {
                this.setVolume(volume);
                this.play();
            } else {
                //((AudioElement)_audio.CloneNode()).Play();
                var i = 0;
                while (i < this._blast.getCount()) {
                    var A = this._blast.getItem(i);
                    //if (A.Paused || A.CurrentTime<0.15f || A.Played.Length==0)
                    if (A.paused || A.currentTime < 0.1 || A.played.length === 0) {
                        if (A.paused || A.currentTime === 0.0 || A.played.length === 0) {
                            A.volume = volume;
                            A.play();
                            i = this._blast.getCount();
                        }
                    }
                    i = (i + 1) | 0;
                }
            }
        },
        _OnPlay: function () {
            this._AM.onPlay(this);
            if (this.onPlay) {
                this.onPlay(this);
            }
        },
        _OnStop: function () {
            this._AM.onStop(this);
            if (this.onStop) {
                this.onStop(this);
            }
        },
        _OnEnd: function () {
            if (this._loop) {
                this.setCurrentTime(0);
                this.play();
            } else {
                this._OnStop();
            }
        },
        _OnUpdate: function () {
            return;
            if (this._loop) {
                //if ((CurrentTime+0.35) >= _audio.Duration)
                if ((this.getCurrentTime() + ((this.getCurrentTime() - this.lasttime) * 0.8)) >= this._audio.duration) {
                    this.setCurrentTime(0);
                    this.play();
                }
                this.lasttime = this.getCurrentTime();
            }
        }
    });

    Bridge.define("BNTest.AudioManager", {
        statics: {
            directory: "",
            __this: null,
            get_this: function () {
                if (BNTest.AudioManager.__this == null) {
                    BNTest.AudioManager.__this = new BNTest.AudioManager();
                }
                return BNTest.AudioManager.__this;
            },
            init: function () {
                if (BNTest.AudioManager.__this == null) {
                    BNTest.AudioManager.__this = new BNTest.AudioManager();
                }
            }
        },
        data: null,
        playing: null,
        ctor: function () {
            this.$initialize();
            this.data = new (System.Collections.Generic.Dictionary$2(String,BNTest.Audio))();
            this.playing = new (System.Collections.Generic.List$1(BNTest.Audio))();
        },
        get: function (path) {
            path = System.String.concat(BNTest.AudioManager.directory, path);
            if (this.data.containsKey(path)) {
                return this.data.get(path);
            } else {
                var AE = new Audio(path);
                //Console.WriteLine("AM:" + path);
                console.log(System.String.concat("AM:", path));
                var A = new BNTest.Audio(AE, path, this);
                this.data.add(path, A);
                return A;
            }
        },
        play: function (path, loop) {
            if (loop === void 0) { loop = false; }
            var A = this.get(path);
            A.setLoop(loop);
            A.play();
            return A;
        },
        blast: function (path, volume) {
            if (volume === void 0) { volume = 1.0; }
            var A = this.get(path);
            A.blast(volume);
        },
        stop: function (path) {
            var A = this.get(path);
            A.stop();
        },
        pause: function (path) {
            var A = this.get(path);
            A.pause();
        },
        onPlay: function (audio) {
            if (!this.playing.contains(audio)) {
                this.playing.add(audio);
            }
        },
        onStop: function (audio) {
            if (this.playing.contains(audio)) {
                this.playing.remove(audio);
            }
        },
        stopAllFromDirectory: function (directory) {
            directory = System.String.concat(BNTest.AudioManager.directory, directory);
            /* int i = 0;
                data[""].ID*/
            //data.ForEach(A => { if (A.ID)})
            BNTest.HelperExtensions.forEach(BNTest.Audio, this.data.getValues(), function (A) {
                if (System.String.startsWith(A.getID(), directory)) {
                    A.stop();
                }
            });
        }
    });

    Bridge.define("BNTest.Entity", {
        model: null,
        alive: true,
        visible: true,
        speed: null,
        game: null,
        lastBB: null,
        _behaviors: null,
        _behaviorTicks: null,
        zOrder: 0,
        ID: null,
        hideHitbox: false,
        solid: true,
        obstruction: false,
        groundFriction: 1,
        platform: false,
        customBoundingBox: null,
        world: null,
        team: -1,
        BB: null,
        behaviorsUpdated: false,
        config: {
            init: function () {
                this.speed = new BNTest.GLVec3.ctor();
                this.BB = new BNTest.BoundingBox.ctor();
            }
        },
        ctor: function (world) {
            this.$initialize();
            //ID = Math.Random();
            this.world = world;
            this.ID = BNTest.Helper.getRandomString();
            this.game = world.game;
            if (this.model != null) {
                this.lastBB = this.getBoundingBox();
            } else {
                this.lastBB = new BNTest.BoundingBox.ctor();
            }
        },
        getHspeed: function () {
            return this.speed.x;
        },
        setHspeed: function (value) {
            this.speed.x = value;
        },
        getVspeed: function () {
            return this.speed.y;
        },
        setVspeed: function (value) {
            this.speed.y = value;
        },
        getZspeed: function () {
            return this.speed.z;
        },
        setZspeed: function (value) {
            this.speed.z = value;
        },
        getPosition: function () {
            return this.model.offset;
        },
        setPosition: function (value) {
            this.model.offset = value;
        },
        getx: function () {
            return this.model.offset.x;
        },
        setx: function (value) {
            this.model.offset.x = value;
        },
        gety: function () {
            return this.model.offset.y;
        },
        sety: function (value) {
            this.model.offset.y = value;
        },
        getz: function () {
            return this.model.offset.z;
        },
        setz: function (value) {
            this.model.offset.z = value;
        },
        getScale: function () {
            return this.model.scale;
        },
        setScale: function (value) {
            this.model.scale = value;
        },
        getHandledLocally: function () {
            return this.game.hoster;
        },
        getHitbox: function () {
            if (this.lastBB == null) {
                return this.getHitbox();
            } else {
                return this.lastBB;
            }
        },
        getBoundingBox: function () {
            if (this.customBoundingBox != null) {
                this.BB.copyFrom(this.customBoundingBox);
                this.BB.add(this.model.offset);
                return this.BB;
                //return CustomBoundingBox + Position;
            }
            return this.model.getBoundingBox();
        },
        addBehavior: function (behavior) {
            if (this._behaviors == null) {
                this._behaviors = new (System.Collections.Generic.List$1(BNTest.EntityBehavior))();
                this._behaviorTicks = new (System.Collections.Generic.List$1(System.Int32))();
            }
            this._behaviors.add(behavior);
            this._behaviorTicks.add(0);
        },
        removeBehavior: function (behavior) {
            if (this._behaviors == null) {
                this._behaviors = new (System.Collections.Generic.List$1(BNTest.EntityBehavior))();
                this._behaviorTicks = new (System.Collections.Generic.List$1(System.Int32))();
            }
            if (this._behaviors.contains(behavior)) {
                this._behaviorTicks.removeAt(this._behaviors.indexOf(behavior));
                this._behaviors.remove(behavior);
            }
        },
        removeBehavior$1: function (T) {
            var $t;
            if (this._behaviors == null) {
                return;
            }
            var L = new (System.Collections.Generic.List$1(BNTest.EntityBehavior))(System.Linq.Enumerable.from(this._behaviors).where(function (behavior) {
                return Bridge.is(behavior, T);
            }));
            /* if (L.Count > 0)
                {
                    RemoveBehavior(L[0]);
                }*/
            $t = Bridge.getEnumerator(L);
            while ($t.moveNext()) {
                var behavior = $t.getCurrent();
                this.removeBehavior(behavior);
            }
            return;
        },
        getBehavior: function (T) {
            if (this._behaviors == null) {
                return Bridge.getDefaultValue(T);
            }
            /* List<EntityBehavior> L = new List<EntityBehavior>(_behaviors.Where(behavior => behavior is T));
                if (L.Count>0)
                {
                    return (dynamic)L[0];
                }*/
            var i = 0;
            var ln = this._behaviors.getCount();
            while (i < ln) {
                var B = this._behaviors.getItem(i);
                if (Bridge.is(B, T)) {
                    return B;
                }
                i = (i + 1) | 0;
            }
            var ret = null;
            return Bridge.getDefaultValue(T);
            /* return _behaviors.OfType<T>().First();
                //return _behaviors.First(behavior => behavior is T).Cast<T>();
                return default(T);*/
        },
        getBehavior$1: function (T, func) {
            var i = 0;
            var ln = this._behaviors.getCount();
            while (i < ln) {
                var B = this._behaviors.getItem(i);
                if (Bridge.is(B, T) && func(B)) {
                    return B;
                }
                i = (i + 1) | 0;
            }
            var ret = null;
            return ret;
            /* List<EntityBehavior> L = new List<EntityBehavior>(_behaviors.Where(behavior => behavior is T));
                Func<EntityBehavior, bool> F = func.ToDynamic();
                return L.First(F).Cast<T>();*/
            //return L.First(func).Cast<T>();
        },
        getTeamColor: function () {
            if (Bridge.is(this, BNTest.ICombatant)) {
                if (this.game.gamePlaySettings.gameMode.getTeams()) {
                    return this.game.getTeamColor(this.team);
                } else {
                    if (Bridge.referenceEquals(this, this.game.localplayer.character)) {
                        return this.game.getTeamColor(1);
                    } else {
                        return this.game.getTeamColor(2);
                    }
                }
            }
            return new BNTest.GLColor();
        },
        sameTeam: function (combatant) {
            if (this == combatant) {
                return true;
            }

            {
                //if (this.As<ICombatant>().Team == combatant.As<ICombatant>().Team)
                if (this.team === combatant.team) {
                    if (this.game.gamePlaySettings.gameMode.getTeams()) {
                        //return ((ICombatant)this).Team != 0;
                        return true;
                    } else {
                        return this.team === 0;
                    }
                }
            }
            return false;
        },
        getBehaviorFromName: function (Name) {
            if (this._behaviors == null) {
                return null;
            }
            //List<EntityBehavior> L = new List<EntityBehavior>(_behaviors.Where(behavior => behavior.GetType().FullName==typeFullName));
            /* List<EntityBehavior> L = new List<EntityBehavior>(_behaviors.Where(behavior => behavior.BehaviorName == Name));
                if (L.Count > 0)
                {
                    return (dynamic)L[0];
                }*/
            try {
                //return _behaviors.First(behavior => behavior.BehaviorName == Name);
                var i = 0;
                var ln = this._behaviors.getCount();
                while (i < ln) {
                    var B = this._behaviors.getItem(i);
                    if (Bridge.referenceEquals(B.getBehaviorName(), Name)) {
                        return B;
                    }
                    i = (i + 1) | 0;
                }
            }
            catch ($e1) {
                $e1 = System.Exception.create($e1);
                Bridge.Console.log(System.String.concat(System.String.concat("Behavior ", Name), " was not found."));
            }
            return null;
        },
        customEvent: function (evt) {

        },
        sendCustomEvent: function (evt, triggerflush) {
            if (triggerflush === void 0) { triggerflush = false; }
            /* dynamic D = Script.Write<object>("{}");
                D.D = Script.Write<object>("{}");
                D.E = "CE";
                D.D.ID = ID;
                D.D.D = evt;*/
            var D = {  };
            D.I = this.ID;
            D.D = evt;
            this.game.sendEvent("CE", D, triggerflush);
        },
        playSound: function (sound) {
            //Game.PlaySoundEffect(getCenter(), sound);
            this.game.playSoundEffect(this.getCenter(), sound);
        },
        getCenter: function () {
            return this.lastBB.getCenter();
            //return GetBoundingBox().Center;
        },
        rotateTest: function (M, val, speed, maxmod) {
            if (val === void 0) { val = "x"; }
            if (speed === void 0) { speed = 1.0; }
            if (maxmod === void 0) { maxmod = 1.0; }
            if (M.Dir == null) {
                M.Dir = 1;
            }
            if (M.Max == null) {
                M.Max = 45;
            }
            if (M.Spd == null) {
                M.Spd = 1.5;
            }
            var max = M.Max;
            var spd = M.Spd;
            if (speed !== 1) {
                spd *= speed;
            }
            if (maxmod !== 1) {
                max *= maxmod;
            }
            //M.Rotation[val] = (double)M.Rotation[val] + (spd * (double)M["Dir"]);
            M.rotation[val] = M.rotation[val] + (spd * M.Dir);
            if (Math.abs(M.rotation[val]) >= max) {
                M.Dir = -M.Dir;
            }
        },
        cacheBoundingBox: function () {
            this.customBoundingBox = null;
            this.customBoundingBox = BNTest.BoundingBox.op_Subtraction(this.getBoundingBox(), this.getPosition());
        },
        updateBehaviors: function () {
            var $t;
            if (this._behaviors != null && !this.behaviorsUpdated) {
                var i = 0;
                while (i < this._behaviors.getCount()) {
                    var behavior = this._behaviors.getItem(i);
                    if (behavior.enabled && Bridge.identity(this._behaviorTicks.getItem(i), ($t = (this._behaviorTicks.getItem(i) + 1) | 0, this._behaviorTicks.setItem(i, $t), $t)) >= behavior.framesPerTick) {
                        this._behaviorTicks.setItem(i, 0);
                        behavior.update();
                    }
                    i = (i + 1) | 0;
                }
                /* foreach (EntityBehavior behavior in _behaviors)
                    {
                    }*/
                this.behaviorsUpdated = true;
            }
        },
        /**
         * updates position,lastBB, and behaviors(only if updatebehavior() has not been run since the last update() )
         *
         * @instance
         * @public
         * @this BNTest.Entity
         * @memberof BNTest.Entity
         * @return  {void}
         */
        update: function () {
            this.model.offset.x += this.speed.x;
            this.model.offset.y += this.speed.y;
            this.model.offset.z += this.speed.z;

            this.updateBehaviors();
            this.lastBB = this.getBoundingBox();
            this.behaviorsUpdated = false;


            if (this.model != null) {
                var cam = this.world.cam;
                //double dist = (cam - LastBB.Center).RoughLength;
                //double dist = (cam - LastBB.Center).Length;
                var dist = cam.roughDistance(this.lastBB.getCenter());
                this.model.inView = dist <= BNTest.World.viewDistance;
            }
        },
        refreshBehaviorTick: function (T) {
            var B = this.getBehavior(T);
            if (B != null) {
                this._behaviorTicks.setItem(this._behaviors.indexOf(B), B.framesPerTick);
            }
        },
        draw: function (gl) {
            var $t;
            /* Ani.Draw(g);
                if (!HideHitbox && Game.ShowHitbox)
                {
                    DrawHitbox(g);
                }*/
            if (this._behaviors != null) {
                $t = Bridge.getEnumerator(this._behaviors);
                while ($t.moveNext()) {
                    var behavior = $t.getCurrent();
                    behavior.draw(gl);
                }
            }
        },
        onRemove: function () {

        }
    });

    Bridge.define("BNTest.IWeaponBehavior", {
        $kind: "interface"
    });

    Bridge.define("BNTest.BoundingBox", {
        statics: {
            op_Addition: function (B, V) {
                return new BNTest.BoundingBox.$ctor1(BNTest.GLVec3.op_Addition(B.min, V), BNTest.GLVec3.op_Addition(B.max, V));
            },
            op_Subtraction: function (B, V) {
                return new BNTest.BoundingBox.$ctor1(BNTest.GLVec3.op_Subtraction(B.min, V), BNTest.GLVec3.op_Subtraction(B.max, V));
            },
            op_Multiply: function (B, V) {
                var A = B.getCenter();
                var S = BNTest.GLVec3.op_Multiply$1((BNTest.GLVec3.op_Multiply(B.getSize(), V)), 0.5);
                return new BNTest.BoundingBox.$ctor1(BNTest.GLVec3.op_Subtraction(A, S), BNTest.GLVec3.op_Addition(A, S));
            },
            op_Multiply$1: function (B, Scale) {
                var V = new BNTest.GLVec3.ctor(Scale, Scale, Scale);
                var A = B.getCenter();
                var S = BNTest.GLVec3.op_Multiply$1((BNTest.GLVec3.op_Multiply(B.getSize(), V)), 0.5);
                return new BNTest.BoundingBox.$ctor1(BNTest.GLVec3.op_Subtraction(A, S), BNTest.GLVec3.op_Addition(A, S));
            }
        },
        min: null,
        max: null,
        $ctor1: function (Min, Max) {
            this.$initialize();
            //this.Min = Min;
            //this.Max = Max;

            this.min = BNTest.GLVec3.min(Min, Max);
            this.max = BNTest.GLVec3.max(Min, Max);
        },
        ctor: function () {
            this.$initialize();
            this.min = new BNTest.GLVec3.ctor();
            this.max = new BNTest.GLVec3.ctor();
        },
        $ctor2: function (size) {
            this.$initialize();
            var hsize = size / 2;
            this.min = new BNTest.GLVec3.ctor(-hsize, -hsize, -hsize);
            this.max = new BNTest.GLVec3.ctor(hsize, hsize, hsize);
        },
        getPosition: function () {
            return this.min;
        },
        setPosition: function (value) {
            var X = this.max.x - this.min.x;
            var Y = this.max.y - this.min.y;
            var Z = this.max.z - this.min.z;
            this.min = value;
            this.max.x = this.min.x + X;
            this.max.y = this.min.y + Y;
            this.max.z = this.min.z + Z;
        },
        getEmpty: function () {
            return this.min.equals(this.max);
        },
        getSize: function () {
            return BNTest.GLVec3.op_Subtraction(this.max, this.min);
        },
        setSize: function (value) {
            this.max = BNTest.GLVec3.op_Subtraction(value, this.min);
        },
        getLeft: function () {
            return this.min.x;
        },
        getTop: function () {
            return this.min.y;
        },
        getBack: function () {
            return this.min.z;
        },
        getRight: function () {
            return this.max.x;
        },
        getBottom: function () {
            return this.max.y;
        },
        getFront: function () {
            return this.max.z;
        },
        getCenter: function () {
            return BNTest.GLVec3.op_Addition(this.min, (BNTest.GLVec3.op_Multiply$1(this.getSize(), 0.5)));
        },
        copyFrom: function (B) {
            var BM = B.min;
            this.min.x = BM.x;
            this.min.y = BM.y;
            this.min.z = BM.z;
            BM = B.max;
            this.max.x = BM.x;
            this.max.y = BM.y;
            this.max.z = BM.z;
        },
        add: function (offset) {
            this.min.x += offset.x;
            this.min.y += offset.y;
            this.min.z += offset.z;

            this.max.x += offset.x;
            this.max.y += offset.y;
            this.max.z += offset.z;
        },
        toString: function () {
            return System.String.concat(System.String.concat(System.String.concat(System.String.concat(System.String.concat("{Pos:", this.min.toString()), "}"), "{Size:"), this.getSize().toString()), "}");
            //return "Min|" + Min.ToString() + " Max|" + Max.ToString();
        },
        clone: function () {
            return new BNTest.BoundingBox.$ctor1(this.min.clone(), this.max.clone());
        },
        intersection$3: function (list) {
            return System.Linq.Enumerable.from(list).where(Bridge.fn.bind(this, $_.BNTest.BoundingBox.f1)).toList(BNTest.BoundingBox);
        },
        intersection: function (list) {
            var ret = System.Array.init(0, null);
            //List<Entity> ret = new List<Entity>();
            var i = 0;
            while (i < list.length) {
                var B = list[i];
                if (B.lastBB.intersection$2(this)) {
                    //ret.Add(B);
                    ret.push(B);
                }
                i = (i + 1) | 0;
            }
            return ret;
            //return list.Where(E => Intersection(E.LastBB)).ToList();
        },
        intersection$1: function (list) {
            //List<Entity> ret = new List<Entity>();
            var ret = System.Array.init(0, null);
            var L = list.items;
            var i = 0;
            while (i < L.length) {
                var B = L[i];
                if (B.lastBB.intersection$2(this)) {
                    //ret.Add(B);
                    ret.push(B);
                }
                i = (i + 1) | 0;
            }
            return ret;
            //return list.Where(E => Intersection(E.LastBB)).ToList();
        },
        intersection$2: function (b) {
            //var a = this;
            //var b = box;
            /* if (Contains(box.Center))
                {
                    return true;
                }*/
            /* return (a.Max.X >= b.Min.X && a.Min.X <= b.Max.X)
                && (a.Max.Y >= b.Min.Y && a.Min.Y <= b.Max.Y)
                && (a.Max.Z >= b.Min.Z & a.Min.Z <= b.Max.Z);*/
            return (this.max.x >= b.min.x && this.min.x <= b.max.x) && (this.max.y >= b.min.y && this.min.y <= b.max.y) && (!!(this.max.z >= b.min.z & this.min.z <= b.max.z));
        },
        contains: function (V) {
            return (BNTest.GLVec3.op_LessThanOrEqual(this.min, V) && BNTest.GLVec3.op_GreaterThanOrEqual(this.max, V));
        }
    });

    Bridge.ns("BNTest.BoundingBox", $_);

    Bridge.apply($_.BNTest.BoundingBox, {
        f1: function (B) {
            return this.intersection$2(B);
        }
    });

    Bridge.define("BNTest.Cube", {
        canvas: null,
        gl: null,
        program: null,
        texture: null,
        useBlending: true,
        alpha: 1,
        useLighting: true,
        ambientR: 0.4,
        ambientG: 0.4,
        ambientB: 0.4,
        lightDirectionX: 0,
        lightDirectionY: 0,
        lightDirectionZ: -1,
        directionalR: 0.25,
        directionalG: 0.25,
        directionalB: 0.25,
        textureImageSrc: "crate.gif",
        mvMatrix: null,
        mvMatrixStack: null,
        pMatrix: null,
        vertexPositionAttribute: 0,
        vertexNormalAttribute: 0,
        textureCoordAttribute: 0,
        vertexColorAttribute: 0,
        pMatrixUniform: null,
        mvMatrixUniform: null,
        nMatrixUniform: null,
        samplerUniform: null,
        useLightingUniform: null,
        ambientColorUniform: null,
        lightingDirectionUniform: null,
        directionalColorUniform: null,
        alphaUniform: null,
        cubeVertexPositionBuffer: null,
        cubeVertexNormalBuffer: null,
        cubeVertexTextureCoordBuffer: null,
        cubeVertexIndexBuffer: null,
        cubeVertexColorBuffer: null,
        xRotation: 0,
        xSpeed: 15,
        yRotation: 0,
        ySpeed: -15,
        z: -5.0,
        currentlyPressedKeys: null,
        lastTime: 0,
        config: {
            init: function () {
                this.mvMatrix = mat4.create();
                this.mvMatrixStack = [];
                this.pMatrix = mat4.create();
                this.currentlyPressedKeys = [];
            }
        },
        getShader: function (gl, id) {
            var shaderScript = document.getElementById(id);

            if (shaderScript == null) {
                return null;
            }

            var str = "";
            var k = shaderScript.firstChild;

            while (k != null) {
                if (k.nodeType === 3) {
                    str = System.String.concat(str, k.textContent);
                }

                k = k.nextSibling;
            }

            var shader;

            if (Bridge.referenceEquals(shaderScript.type, "x-shader/x-fragment")) {
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            } else if (Bridge.referenceEquals(shaderScript.type, "x-shader/x-vertex")) {
                shader = gl.createShader(gl.VERTEX_SHADER);
            } else {
                return null;
            }

            gl.shaderSource(shader, str);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                Bridge.global.alert(gl.getShaderInfoLog(shader));
                return null;
            }

            return shader;
        },
        initShaders: function () {
            var fragmentShader = this.getShader(this.gl, "shader-fs");
            var vertexShader = this.getShader(this.gl, "shader-vs");
            var shaderProgram = this.gl.createProgram();

            if (Bridge.is(shaderProgram, System.Int32)) {
                Bridge.global.alert("Could not initialise program");
            }

            this.gl.attachShader(shaderProgram, vertexShader);
            this.gl.attachShader(shaderProgram, fragmentShader);
            this.gl.linkProgram(shaderProgram);

            if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
                Bridge.global.alert("Could not initialise shaders");
            }

            this.gl.useProgram(shaderProgram);

            this.vertexPositionAttribute = this.gl.getAttribLocation(shaderProgram, "aVertexPosition");
            this.vertexNormalAttribute = this.gl.getAttribLocation(shaderProgram, "aVertexNormal");
            this.textureCoordAttribute = this.gl.getAttribLocation(shaderProgram, "aTextureCoord");
            this.vertexColorAttribute = this.gl.getAttribLocation(shaderProgram, "aVertexColor");

            this.gl.enableVertexAttribArray(this.vertexPositionAttribute);
            this.gl.enableVertexAttribArray(this.vertexNormalAttribute);
            this.gl.enableVertexAttribArray(this.textureCoordAttribute);

            this.pMatrixUniform = this.gl.getUniformLocation(shaderProgram, "uPMatrix");
            this.mvMatrixUniform = this.gl.getUniformLocation(shaderProgram, "uMVMatrix");
            this.nMatrixUniform = this.gl.getUniformLocation(shaderProgram, "uNMatrix");
            this.samplerUniform = this.gl.getUniformLocation(shaderProgram, "uSampler");
            this.useLightingUniform = this.gl.getUniformLocation(shaderProgram, "uUseLighting");
            this.ambientColorUniform = this.gl.getUniformLocation(shaderProgram, "uAmbientColor");
            this.lightingDirectionUniform = this.gl.getUniformLocation(shaderProgram, "uLightingDirection");
            this.directionalColorUniform = this.gl.getUniformLocation(shaderProgram, "uDirectionalColor");
            this.alphaUniform = this.gl.getUniformLocation(shaderProgram, "uAlpha");

            this.program = shaderProgram;
        },
        handleLoadedTexture: function (image) {
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        },
        initTexture: function () {
            this.texture = this.gl.createTexture();

            var textureImageElement = new Image();

            textureImageElement.onload = Bridge.fn.bind(this, function (ev) {
                this.handleLoadedTexture(textureImageElement);
            });

            textureImageElement.src = this.textureImageSrc;
        },
        setMatrixUniforms: function () {
            this.gl.uniformMatrix4fv(this.pMatrixUniform, false, this.pMatrix);
            this.gl.uniformMatrix4fv(this.mvMatrixUniform, false, this.mvMatrix);

            var normalMatrix = mat3.create();

            mat4.toInverseMat3(this.mvMatrix, normalMatrix);
            mat3.transpose(normalMatrix);

            this.gl.uniformMatrix3fv(this.nMatrixUniform, false, normalMatrix);
        },
        degToRad: function (degrees) {
            return degrees * Math.PI / 180;
        },
        handleKeyDown: function (e) {
            this.currentlyPressedKeys[e.keyCode] = true;
        },
        handleKeyUp: function (e) {
            this.currentlyPressedKeys[e.keyCode] = false;
        },
        handleKeys: function () {
            if (this.currentlyPressedKeys[81]) {
                this.z -= 0.05;
            }

            if (this.currentlyPressedKeys[69]) {
                this.z += 0.05;
            }

            if (this.currentlyPressedKeys[65]) {
                this.ySpeed = (this.ySpeed - 1) | 0;
            }

            if (this.currentlyPressedKeys[68]) {
                this.ySpeed = (this.ySpeed + 1) | 0;
            }

            if (this.currentlyPressedKeys[87]) {
                this.xSpeed = (this.xSpeed - 1) | 0;
            }

            if (this.currentlyPressedKeys[83]) {
                this.xSpeed = (this.xSpeed + 1) | 0;
            }
        },
        initBuffers: function () {
            this.cubeVertexPositionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);

            var vertices = [-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0];


            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

            this.cubeVertexColorBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);

            var vcolor = System.Array.init((((((Bridge.Int.div(vertices.length, 3)) | 0)) * 4) | 0), 0);
            var i = 0;
            var r = 1;
            var g = 1;
            var b = 1;
            var a = 1;
            while (((i + 3) | 0) < vcolor.length) {
                vcolor[i] = r;
                vcolor[((i + 1) | 0)] = g;
                vcolor[((i + 2) | 0)] = b;
                vcolor[((i + 3) | 0)] = a;
                i = (i + 4) | 0;
            }
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vcolor), this.gl.STATIC_DRAW);

            this.cubeVertexNormalBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);

            var vertexNormals = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0];

            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexNormals), this.gl.STATIC_DRAW);

            this.cubeVertexTextureCoordBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);

            var textureCoords = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];

            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoords), this.gl.STATIC_DRAW);

            this.cubeVertexIndexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);

            var cubeVertexIndices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];

            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), this.gl.STATIC_DRAW);
        },
        drawCube: function () {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
            this.gl.vertexAttribPointer(this.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);

            /* gl.BindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
                gl.VertexAttribPointer(this.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);*/


            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
            this.gl.vertexAttribPointer(this.vertexNormalAttribute, 3, this.gl.FLOAT, false, 0, 0);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
            this.gl.vertexAttribPointer(this.textureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);
            //gl.BlendColor(1, 1, 1,1);
            this.ambientR = 1;
            this.ambientG = 1;
            this.ambientB = 1;

            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

            this.gl.uniform1i(this.samplerUniform, 0);

            // Add Blending
            if (this.useBlending) {
                this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
                this.gl.enable(this.gl.BLEND);
                this.gl.disable(this.gl.DEPTH_TEST);
                this.gl.uniform1f(this.alphaUniform, this.alpha);
            } else {
                this.gl.disable(this.gl.BLEND);
                this.gl.enable(this.gl.DEPTH_TEST);
                this.gl.uniform1f(this.alphaUniform, 1);
            }

            // Add Lighting
            this.gl.uniform1i(this.useLightingUniform, this.useLighting);
            if (this.useLighting) {
                this.gl.uniform3f(this.ambientColorUniform, this.ambientR, this.ambientG, this.ambientB);

                var lightingDirection = [this.lightDirectionX, this.lightDirectionY, this.lightDirectionZ];
                var adjustedLD = vec3.create();

                vec3.normalize(lightingDirection, adjustedLD);
                vec3.scale(adjustedLD, -1);

                this.gl.uniform3fv(this.lightingDirectionUniform, adjustedLD);
                this.gl.uniform3f(this.directionalColorUniform, this.directionalR, this.directionalG, this.directionalB);
            }

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);

            this.setMatrixUniforms();

            this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0);
        },
        drawScene: function () {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            mat4.perspective(45, this.canvas.width / this.canvas.height, 0.1, 100, this.pMatrix);
            mat4.identity(this.mvMatrix);
            mat4.translate(this.mvMatrix, [0.0, 0.0, this.z]);
            mat4.rotate(this.mvMatrix, this.degToRad(this.xRotation), [1, 0, 0]);
            mat4.rotate(this.mvMatrix, this.degToRad(this.yRotation), [0, 1, 0]);
            this.drawCube();
            mat4.translate(this.mvMatrix, [2.0, 0.0, 0.0]);
            this.drawCube();

            /* gl.BindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
                gl.VertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

                gl.BindBuffer(gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
                gl.VertexAttribPointer(this.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

                gl.BindBuffer(gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
                gl.VertexAttribPointer(this.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

                gl.ActiveTexture(gl.TEXTURE0);
                gl.BindTexture(gl.TEXTURE_2D, this.texture);

                gl.Uniform1i(this.samplerUniform, 0);

                // Add Blending
                if (this.useBlending)
                {
                    gl.BlendFunc(gl.SRC_ALPHA, gl.ONE);
                    gl.Enable(gl.BLEND);
                    gl.Disable(gl.DEPTH_TEST);
                    gl.Uniform1f(this.alphaUniform, this.alpha);
                }
                else
                {
                    gl.Disable(gl.BLEND);
                    gl.Enable(gl.DEPTH_TEST);
                    gl.Uniform1f(this.alphaUniform, 1);
                }

                // Add Lighting
                gl.Uniform1i(this.useLightingUniform, this.useLighting);

                if (this.useLighting)
                {
                    gl.Uniform3f(this.ambientColorUniform, this.ambientR, this.ambientG, this.ambientB);

                    var lightingDirection = new double[] { this.lightDirectionX, this.lightDirectionY, this.lightDirectionZ };
                    var adjustedLD = Vec3.Create();

                    Vec3.Normalize(lightingDirection, adjustedLD);
                    Vec3.Scale(adjustedLD, -1);

                    gl.Uniform3fv(this.lightingDirectionUniform, adjustedLD);
                    gl.Uniform3f(this.directionalColorUniform, this.directionalR, this.directionalG, this.directionalB);
                }

                gl.BindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);

                this.SetMatrixUniforms();

                gl.DrawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);*/
        },
        animate: function () {
            var timeNow = new Date().getTime();

            if (this.lastTime !== 0) {
                var elapsed = timeNow - this.lastTime;

                this.xRotation += (this.xSpeed * elapsed) / 1000.0;
                this.yRotation += (this.ySpeed * elapsed) / 1000.0;
            }

            this.lastTime = timeNow;
        },
        tick: function () {
            BNTest.App.initSettings(this);
            this.handleKeys();
            this.drawScene();
            this.animate();
            Bridge.global.setTimeout(Bridge.fn.bind(this, this.tick), 20);
        }
    });

    Bridge.define("BNTest.GameMode.ModeTypes", {
        $kind: "enum",
        statics: {
        
            Skirmish: 0,
            /**
             * Singleplayer, gameplay is changed up with a mode specific task.
             *
             * @static
             * @public
             * @memberof number
             * @constant
             * @default 1
             * @type number
             */
            Challenge: 1,
            /**
             * Like challenge, but is designed for multiple human players.
             *
             * @static
             * @public
             * @memberof number
             * @constant
             * @default 2
             * @type number
             */
            CallengeCoop: 2
        }
    });

    Bridge.define("BNTest.GamePad", {
        connected: false,
        axes: null,
        buttons: null,
        id: null,
        index: System.Int64(0),
        ctor: function (pad) {
            this.$initialize();
            this.id = pad.id;
            this.index = System.Int64(pad.index);
            this.connected = pad.connected;
            this.axes = pad.axes;

            var length = pad.buttons.length;

            this.buttons = System.Array.init(length, null);
            var i = 0;
            while (i < length) {
                this.buttons[i] = pad.buttons[i];
                i = (i + 1) | 0;
            }
        },
        update: function () {
            var i = 0;
            while (i < this.buttons.length) {
                this.buttons[i].tapped = false;
                i = (i + 1) | 0;
            }
        },
        combineData: function (pad) {
            if (Bridge.referenceEquals(this.id, pad.id)) {
                this.connected = pad.connected;
                this.axes = pad.axes;
                //buttons = pad.buttons;
                this.combineButtonData(pad.buttons);
            }
        },
        combineButtonData: function (buttons) {
            var Lb = buttons;
            this.buttons = buttons;
            var i = 0;
            while (i < buttons.length) {
                if (buttons[i].pressed && !Lb[i].pressed) {
                    buttons[i].tapped = true;
                }
                i = (i + 1) | 0;
            }
        }
    });

    Bridge.define("BNTest.GamePadButton", {
        tapped: false,
        pressed: false,
        value: 0,
        ctor: function (button) {
            this.$initialize();
            this.pressed = button.pressed;
            this.value = button.value;
            this.tapped = false;
        }
    });

    Bridge.define("BNTest.GamePadManager", {
        statics: {
            _this: null
        },
        keyboard: null,
        gamepads: null,
        tempgamepads: null,
        ctor: function () {
            this.$initialize();
            this.gamepads = new (System.Collections.Generic.List$1(BNTest.GamePad))();
            this.update();
        },
        getactiveGamepads: function () {
            return new (System.Collections.Generic.List$1(BNTest.GamePad))(System.Linq.Enumerable.from(this.gamepads).where($_.BNTest.GamePadManager.f1));
        },
        callBackTest: function () {
            Bridge.global.alert("Callback!");
        },
        getPad: function (id) {
            var L = new (System.Collections.Generic.List$1(BNTest.GamePad))(System.Linq.Enumerable.from(this.gamepads).where(function (gamepad) {
                return Bridge.referenceEquals(gamepad.id, id);
            }));
            if (L.getCount() > 0) {
                return L.getItem(0);
            }
            return null;
        },
        update: function () {
            var i = 0;
            while (i < this.gamepads.getCount()) {
                this.gamepads.getItem(i).update();
                i = (i + 1) | 0;
            }
            i = 0;
            this.tempgamepads = (navigator.getGamepads() || navigator.webkitGetGamepads() || []);
            var pads = new (System.Collections.Generic.List$1(BNTest.GamePad))();
            while (i < this.tempgamepads.length) {
                if (this.tempgamepads[i] != null) {
                    var pad = new BNTest.GamePad(this.tempgamepads[i]);
                    this._Update(pad);
                    pads.add(pad);
                }
                i = (i + 1) | 0;
            }
            i = 0;
            //Adds any newly found gamepads.
            while (i < pads.getCount()) {
                var id = pads.getItem(i).id;
                var j = 0;
                var ok = true;
                while (j < this.gamepads.getCount()) {
                    if (Bridge.referenceEquals(this.gamepads.getItem(j).id, id)) {
                        ok = false;
                    }
                    j = (j + 1) | 0;
                }
                if (ok) {
                    this.gamepads.add(pads.getItem(i));
                }
                i = (i + 1) | 0;
            }

            /* Action F = CallBackTest;
                Script.Write("setTimeout(F, 3000);");*/
            //Global.SetTimeout()
        },
        _Update: function (pad) {
            var i = 0;
            while (i < this.gamepads.getCount()) {
                var P = this.gamepads.getItem(i);
                if (Bridge.referenceEquals(P.id, pad.id)) {
                    P.combineData(pad);
                }
                i = (i + 1) | 0;
            }
        }
    });

    Bridge.ns("BNTest.GamePadManager", $_);

    Bridge.apply($_.BNTest.GamePadManager, {
        f1: function (gamepad) {
            return gamepad.connected;
        }
    });

    Bridge.define("BNTest.GamePlaySettings", {
        online: false,
        myCharacter: "Reisen",
        gameMode: null,
        myTeam: 1,
        blueNPCs: 3,
        redNPCs: 2,
        roomID: "",
        hostNPOut: null,
        computerAIModifier: 1.0,
        ctor: function () {
            this.$initialize();
            //GameMode = new GameMode();
            this.gameMode = BNTest.GameMode.deathMatch;
        }
    });

    Bridge.define("BNTest.GLColor", {
        statics: {
            white: null,
            config: {
                init: function () {
                    this.white = new BNTest.GLColor(1, 1, 1);
                }
            },
            fromArgb: function (a, r, g, b) {
                return new BNTest.GLColor(a / 255.0, r / 255.0, g / 255.0, b / 255.0);
            },
            colorFromAhsb: function (a, h, s, b) {

                /* if (0 > a || 255 < a)
                {
                    throw new ArgumentOutOfRangeException("a", a,
                      Properties.Resources.InvalidAlpha);
                }
                if (0f > h || 360f < h)
                {
                    throw new ArgumentOutOfRangeException("h", h,
                      Properties.Resources.InvalidHue);
                }
                if (0f > s || 1f < s)
                {
                    throw new ArgumentOutOfRangeException("s", s,
                      Properties.Resources.InvalidSaturation);
                }
                if (0f > b || 1f < b)
                {
                    throw new ArgumentOutOfRangeException("b", b,
                      Properties.Resources.InvalidBrightness);
                }*/

                if (0 === s) {
                    return BNTest.GLColor.createShade(b / 255.0);
                }

                var fMax, fMid, fMin;
                var iSextant, iMax, iMid, iMin;

                if (0.5 < b) {
                    fMax = b - (b * s) + s;
                    fMin = b + (b * s) - s;
                } else {
                    fMax = b + (b * s);
                    fMin = b - (b * s);
                }

                iSextant = Bridge.Int.clip32(Math.floor(h / 60.0));
                if (300.0 <= h) {
                    h -= 360.0;
                }
                h /= 60.0;
                h -= 2.0 * Math.floor(((iSextant + 1.0) % 6.0) / 2.0);
                if (0 === iSextant % 2) {
                    fMid = h * (fMax - fMin) + fMin;
                } else {
                    fMid = fMin - h * (fMax - fMin);
                }

                iMax = System.Convert.toInt32(fMax * 255);
                iMid = System.Convert.toInt32(fMid * 255);
                iMin = System.Convert.toInt32(fMin * 255);

                switch (iSextant) {
                    case 1: 
                        return BNTest.GLColor.fromArgb(a, iMid, iMax, iMin);
                    case 2: 
                        return BNTest.GLColor.fromArgb(a, iMin, iMax, iMid);
                    case 3: 
                        return BNTest.GLColor.fromArgb(a, iMin, iMid, iMax);
                    case 4: 
                        return BNTest.GLColor.fromArgb(a, iMid, iMin, iMax);
                    case 5: 
                        return BNTest.GLColor.fromArgb(a, iMax, iMin, iMid);
                    default: 
                        return BNTest.GLColor.fromArgb(a, iMax, iMid, iMin);
                }
            },
            randomB: function (RMn, GMn, BMn, RMx, GMx, BMx) {
                if (RMn === void 0) { RMn = 0.0; }
                if (GMn === void 0) { GMn = 0.0; }
                if (BMn === void 0) { BMn = 0.0; }
                if (RMx === void 0) { RMx = 1.0; }
                if (GMx === void 0) { GMx = 1.0; }
                if (BMx === void 0) { BMx = 1.0; }
                return new BNTest.GLColor(RMn + (Math.random() * (RMx - RMn)), GMn + (Math.random() * (GMx - GMn)), BMn + (Math.random() * (BMx - BMn)));
            },
            random$1: function (max) {
                return new BNTest.GLColor(Math.random() * max, Math.random() * max, Math.random() * max, 1);
            },
            random: function () {
                return new BNTest.GLColor(Math.random(), Math.random(), Math.random(), 1);
            },
            random2: function () {
                return new BNTest.GLColor(Math.random(), Math.random(), Math.random(), Math.random());
            },
            createShade: function (Value) {
                return new BNTest.GLColor(Value, Value, Value, 1);
            },
            op_Addition: function (C1, C2) {
                var R = BNTest.MathHelper.clamp(C1.r + C2.r);
                var G = BNTest.MathHelper.clamp(C1.g + C2.g);
                var B = BNTest.MathHelper.clamp(C1.b + C2.b);
                //var A = MathHelper.Clamp(C1.A + C2.A);
                return new BNTest.GLColor(R, G, B, C1.a);
            },
            op_Subtraction: function (C1, C2) {
                var R = BNTest.MathHelper.clamp(C1.r - C2.r);
                var G = BNTest.MathHelper.clamp(C1.g - C2.g);
                var B = BNTest.MathHelper.clamp(C1.b - C2.b);
                //var A = MathHelper.Clamp(C1.A - C2.A);
                return new BNTest.GLColor(R, G, B, C1.a);
            },
            op_Multiply: function (C, brightness) {
                return new BNTest.GLColor(C.r * brightness, C.g * brightness, C.b * brightness);
            }
        },
        a: 0,
        r: 0,
        g: 0,
        b: 0,
        ctor: function (R, G, B, A) {
            if (R === void 0) { R = 0.0; }
            if (G === void 0) { G = 0.0; }
            if (B === void 0) { B = 0.0; }
            if (A === void 0) { A = 1.0; }

            this.$initialize();
            this.r = R;
            this.g = G;
            this.b = B;
            this.a = A;
        },
        getRoughLength: function () {
            return Math.abs(this.r) + Math.abs(this.g) + Math.abs(this.b);
        },
        equals: function (o) {
            //if (o is GLColor)
            //if (o != null && o.As<GLColor>().R.As<bool>())
            {
                var C = o;
                return C.r === this.r && C.g === this.g && C.b === this.b && C.a === this.a;
            }
            return Bridge.equals(this, o);
        },
        similar: function (C) {
            if (this.equals(C)) {
                return true;
            }
            var R = Math.abs(this.r - C.r);
            var G = Math.abs(this.g - C.g);
            var B = Math.abs(this.b - C.b);
            //return (R + G + B) <= 0.005;
            return (R + G + B) <= 0.0075;
        },
        toARGB: function () {
            var R = Bridge.Int.clip32(this.r * 255);
            var G = Bridge.Int.clip32(this.g * 255);
            var B = Bridge.Int.clip32(this.b * 255);
            var A = Bridge.Int.clip32(this.a * 255);

            //int[] b = new int[] { (int)(this.R * 255), (int)(this.G * 255), (int)(this.B * 255), (int)(this.A * 255) };
            return ((((((Bridge.Int.clip32(this.r * 255) + (Bridge.Int.clip32(this.g * 255) << 8)) | 0) + (Bridge.Int.clip32(this.b * 255) << 16)) | 0) + (Bridge.Int.clip32(this.a * 255) << 24)) | 0);
        },
        fromArgb: function (ARGB) {
            var R = ((ARGB) & 255) / 255.0;
            var G = ((ARGB >> 8) & 255) / 255.0;
            var B = ((ARGB >> 16) & 255) / 255.0;
            var A = ((ARGB >> 24) & 255) / 255.0;
            return new BNTest.GLColor(R, G, B, A);
        },
        setAhsb: function (h, s, b) {
            var C = BNTest.GLColor.colorFromAhsb(255, h, s, b);
            this.r = C.r;
            this.g = C.g;
            this.b = C.b;
        },
        copy: function (C) {
            this.a = C.a;
            this.r = C.r;
            this.g = C.g;
            this.b = C.b;
        }
    });

    Bridge.define("BNTest.GLDemo", {
        statics: {
            allowAlpha: true,
            VK_Enter: 13,
            _this: null,
            missingTime: 0,
            lastTime: 0,
            updated: true,
            doDrawScene: function (elapsedTime) {
                requestAnimationFrame(BNTest.GLDemo.doDrawScene);
                if (BNTest.GLDemo.lastTime === 0) {
                    BNTest.GLDemo.lastTime = elapsedTime;
                }
                var T = (elapsedTime - BNTest.GLDemo.lastTime);
                if (!BNTest.GLDemo._this.paused) {
                    BNTest.GLDemo._this.totaltime += T;
                }
                BNTest.GLDemo.missingTime += T;
                if (BNTest.GLDemo.missingTime > 48) {
                    BNTest.GLDemo.missingTime = 35;
                }
                if (BNTest.GLDemo.updated) {
                    BNTest.GLDemo._this.drawScene(elapsedTime);
                    BNTest.GLDemo.updated = false;
                }
                BNTest.GLDemo._this.update(elapsedTime);
                BNTest.GLDemo.missingTime -= 16.6667;
                BNTest.GLDemo.updated = true;
                if (BNTest.GLDemo.missingTime >= 16.6667) {
                    BNTest.GLDemo._this.update(elapsedTime);
                    BNTest.GLDemo.missingTime -= 16.6667;
                    BNTest.GLDemo.updated = true;
                }
                BNTest.GLDemo.lastTime = elapsedTime;


                //Helper.Log("time:" + elapsedTime + " missing:" + missingTime);
            },
            test: function (self) {
                /* var CV = new HTMLCanvasElement();
                CV.Width = 20;
                CV.Height = 20;
                var G = Helper.GetContext(CV);
                G.FillStyle = "#FF00FF";
                G.FillRect(0, 0, 4, 4);
                G.FillStyle = "#00FFFF";
                G.FillRect(0, 0, 2, 2);
                G.FillRect(2, 2, 2, 2);

                //G.FillStyle = "#FFFFFF";
                //G.FillRect(0, 0, 4, 4);
                var gl = self.gl;
                var img = new HTMLImageElement();
                img.Src = CV.ToDataURL();
                var texture = gl.CreateTexture();

                gl.PixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.BindTexture(gl.TEXTURE_2D, texture);
                gl.TexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                gl.TexParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.TexParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.GenerateMipmap(gl.TEXTURE_2D);
                gl.BindTexture(gl.TEXTURE_2D, null);

                gl.ActiveTexture(gl.TEXTURE0);
                gl.BindTexture(gl.TEXTURE_2D, texture);
                gl.Uniform1i(self.samplerUniform, 0);
                return;*/

                self._test();

                /* var timg = AnimationLoader.Get("test")[0];
                var CV = new HTMLCanvasElement();
                var G = Helper.GetContext(CV);
                G.DrawImage(timg,0,0);
                var img = new HTMLImageElement();
                img.Src = CV.ToDataURL();

                Global.SetTimeout(() => self._test(img),20);*/
                //self._test();
            }
        },
        canvas: null,
        gl: null,
        shaderProgram: null,
        cubeVerticesBuffer: null,
        cubeVerticesColorBuffer: null,
        cubeVerticesIndexBuffer: null,
        vertexPositionAttribute: 0,
        vertexColorAttribute: 0,
        localplayer: null,
        boss: null,
        netPlayNeedsFlush: false,
        cameracontrols: false,
        matrixNeedsFlush: true,
        vertexTextureCoordAttribute: 0,
        samplerUniform: null,
        alphaUniform: null,
        colorUniform: null,
        world: null,
        camera: null,
        foliage: null,
        hoster: true,
        fogActive: false,
        cameraDist: 300,
        lastCameraDist: 0,
        lastZnear: 0,
        bGMVolume: 0.4,
        bGMMute: false,
        gamePlaySettings: null,
        currentAlpha: 1,
        alphalist: null,
        cubeRotation: 0.0,
        cubeXOffset: 0.0,
        cubeYOffset: 0.0,
        cubeZOffset: 0.0,
        lastCubeUpdateTime: 0,
        theDepthFunc: 0,
        xIncValue: 0.0,
        yIncValue: 0.0,
        zIncValue: 0.0,
        mouseAngle: 0,
        loadProgress: 0,
        maxLoadProgress: 0,
        maxLoadQueue: 0,
        model: null,
        perspectiveMatrix: null,
        mvMatrix: null,
        matrix: null,
        depthTest: false,
        entities: null,
        players: null,
        online: false,
        frame: 0,
        music: null,
        VTS: null,
        TS: null,
        LTS: null,
        BTS: null,
        radar: null,
        ended: true,
        gameover: false,
        started: false,
        totaltime: 0,
        lastsong: "",
        titleRunning: false,
        titlescreen: true,
        defaultBulletSpeedRate: 0.65,
        bulletSpeedRate: 1,
        wavetime: 3,
        wave: 0,
        enemyList: null,
        smooth: true,
        lastModelName: "rahmoo",
        lastModel: null,
        nPCSpawntime: 0,
        dNPCSpawntime: 7500.0,
        nextSpawn: 0,
        nPCs: 0,
        maxWaveDelay: 150,
        waveDelay: 0,
        paused: false,
        latencyM: 100,
        dlatency: 0,
        tflat: null,
        mvMatrixStack: null,
        pUniform: null,
        mvUniform: null,
        config: {
            init: function () {
                this.alphalist = [];
                this.matrix = new BNTest.WGMatrix();
                this.entities = new (System.Collections.Generic.List$1(BNTest.Entity))();
                this.players = new (System.Collections.Generic.List$1(BNTest.Player))();
                this.VTS = new BNTest.TextSprite();
                this.TS = new BNTest.TextSprite();
                this.LTS = new BNTest.TextSprite();
                this.BTS = new BNTest.TextSprite();
                this.radar = new BNTest.Sprite();
                this.tflat = System.Array.init(16, 0);
                this.mvMatrixStack = [];
            }
        },
        start: function (canvas) {
            this.canvas = canvas;

            this.VTS.setText(System.String.concat("Version:", BNTest.App.gameVersion));
            this.VTS.setFontSize(16);
            this.VTS.setTextColor("#FFFFFF");
            this.VTS.setShadowBlur(5);
            this.VTS.setShadowOffset(new BNTest.Vector2(3, 3));
            this.VTS.setShadowColor("#000000");

            /* Radar.spriteBuffer.Width = 100;
                Radar.spriteBuffer.Height = 100;*/
            this.radar.spriteBuffer.width = (this.radar.spriteBuffer.height = 150, 150);


            BNTest.AnimationLoader.init();
            BNTest.AudioManager.init();
            BNTest.AnimationLoader.directory = "Assets/Images/";
            BNTest.AudioManager.directory = "Assets/Audio/";

            var path = "Assets/Images.zip";
            var f = System.String.concat(path, "://rahmoo_0.png");
            console.log(System.String.concat("test zip path:", f));

            /* var path = "Assets/Images.zip";
                var zip = new ZipLoader(path);
                var f = path + "://rahmoo_0.png";
                var img = zip.loadImage(f);
                f = path + "://rahyamoo_0.png";
                string err = "";
                try
                {
                    err = zip.loadImage(f);
                }
                catch
                {

                }*/


            //executes on google chrome.
            var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            //if (!Script.Write<bool>("typeof InstallTrigger !== 'undefined'"))
            if (!isFirefox) {
                BNTest.AnimationLoader.get_this().setZip("Assets/Images.zip");
            } else {
                this.bGMVolume *= 0.75;
            }
            if (BNTest.App.DEBUG) {
                this.bGMMute = true;
            }

            /* var I = new HTMLImageElement();
                I.Src = img.As<string>();
                Document.Body.RemoveChild(App.Div);
                Document.Body.AppendChild(I);*/

            //var img = zip.load(f);

            this.initWebGL(canvas);

            //music = AudioManager._this.Play("BGM/music.ogg", true);
            /* music = AudioManager._this.Play("BGM/titlescreen.ogg", true);
                music.Volume = BGMVolume;*/
            this.playMusic("titlescreen", 0.6);
            //music.CurrentTime = 120;
            //music.CurrentTime = 135;

            BNTest.GLDemo._this = this;

            if (this.gl != null) {
                this.gl.clearColor(0, 0, 0, 1);
                this.gl.clearColor(0.5, 0.5, 0.5, 1);
                this.gl.clearDepth(1);
                if (!BNTest.GLDemo.allowAlpha) {
                    this.depthTest = true;
                    this.gl.enable(this.gl.DEPTH_TEST);
                    //gl.DepthFunc(gl.LEQUAL);
                    this.setDepthFunc(this.gl.LEQUAL);
                } else {
                    this.depthTest = true;
                    //gl.Disable(gl.DEPTH_TEST);
                    this.gl.enable(this.gl.DEPTH_TEST);
                    this.gl.depthFunc(this.gl.LEQUAL);
                    //gl.DepthFunc(gl.GREATER);

                    this.gl.enable(this.gl.BLEND);
                    //gl.Disable(gl.DEPTH_TEST);

                    //gl.DepthFunc(gl.LESS);
                    //gl.DepthFunc(gl.LEQUAL);
                    this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
                    //gl.BlendFunc(gl.SRC_ALPHA, gl.ONE);
                    //gl.BlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                    //gl.BlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                    //gl.BlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    //gl.BlendFunc(gl.SRC_ALPHA, gl.ONE);
                    //gl.BlendFunc(gl.SRC_ALPHA, gl.ZERO);

                    //gl.BlendFunc(gl.ONE_MINUS_DST_ALPHA, gl.DST_ALPHA);

                }


                this.initShaders();

                this.initBuffers();


                //Global.SetTimeout(drawScene, 15);
                Bridge.global.requestAnimationFrame(BNTest.GLDemo.doDrawScene);
                //Script.Write("requestAnimationFrame(callback)");

                var self = this;
                this.camera = new BNTest.Model(self);

                //camera.Rotation.X = 45;
                this.camera.rotation.x = 40;

                this.world = new BNTest.World(self);
                //world = new Model(self);
                this.camera.children.add(this.world.model);
                this.foliage = new BNTest.Foliage(this.world);
                this.generateFloor();

                this.world.add(this.foliage);
                /* var FVM = VoxelMap.Gen(100,2,0,true,false,true);
                    var msh = new Mesh(self);
                    msh.AddVoxelMap(FVM,false,false,true);
                    var floor = new Entity(world);
                    floor.model = new Model(self);


                    floor.y = 10;
                
                    floor.Scale.X = 4;
                    floor.Scale.Y = floor.Scale.X;
                    floor.Scale.Z = floor.Scale.X;

                    GLVec3 V = msh.Size * floor.Scale.X*0.5;
                    floor.x -= V.X;
                    floor.z -= V.Z;
                    floor.model.meshes.Add(msh);

                    floor.GetBoundingBox();


                
                    world.Add(floor);
                    /////////
                    FVM = VoxelMap.Gen(100, 2, 0, true, false, true,true);
                    msh = new Mesh(self);
                    msh.AddVoxelMap(FVM, false, false, true);
                    floor = new Entity(world);
                    floor.model = new Model(self);

                    floor.groundFriction = 0.05;
                

                    floor.y = 10;

                    floor.Scale.X = 4;
                    floor.Scale.Y = floor.Scale.X;
                    floor.Scale.Z = floor.Scale.X;

                    V = msh.Size * floor.Scale.X * 0.5;
                    floor.x -= V.X;
                    floor.z += V.Z;
                    floor.model.meshes.Add(msh);

                    floor.GetBoundingBox();



                    world.Add(floor);*/

                this.gamePlaySettings = new BNTest.GamePlaySettings();
                this.gamePlaySettings.gameMode = BNTest.GameMode.teamBattle;


                this.localplayer = new BNTest.Player(true, false);
                var character = "reimu";
                //character = "marisa";
                //character = "koishi";
                //character = "aya";
                //character = "youmu";
                //character = "reisen";
                //character = "tenshi";
                var PC = new BNTest.PlayerCharacter(this.world, this.localplayer, character);
                this.localplayer.character = PC;
                //PC.Position.Y = -15;
                PC.getPosition().y = -15000;
                PC.setCoins(1000);
                //PC.defense = 4;
                PC.defense = 5;
                PC.visible = false;
                PC.setHitboxSize(PC.getHitboxSize()*0.35);

                this.world.add(PC);

                /* var NPC = new PlayerCharacter(world, new Player(true, true));
                    NPC.x += 50;
                    NPC.z += 200;
                    world.Add(NPC);

                    NPC = new PlayerCharacter(world, new Player(true, true));
                    NPC.x -= 50;
                    NPC.z += 200;
                    world.Add(NPC);*/

                //int i = 10;
                //int i = 20;
                //int i = 20;
                /* while (i>0)
                    {
                        AddNPC();
                        i--;
                    }*/
                /* int i = 10;
                
                    NextSpawn = -((NPCSpawntime-1) * (i / 2));*/

                var box = new BNTest.DonationBox(this.world);
                this.world.add(box);
                //box.LastBB = box.GetBoundingBox();

                var c = new BNTest.Coin(this.world);
                c.solid = false;
                c.setPosition(new BNTest.GLVec3.ctor(50, 10000, 50));
                c.getBehavior(BNTest.LifeSpan).HP = 1;
                c.model.setVisible(false);
                this.world.add(c);

                /* var c = new Coin(world);
                    c.Solid = false;
                    c.Position = new GLVec3(50, 0, 50);
                    world.Add(c);*/
                /* var tree = new Tree(world);
                    tree.Position = new GLVec3(-100, tree.Position.Y, -100);
                    world.Add(tree);*/
                var F = this.foliage;
                //var F = new Foliage(world);
                this.world.add(F);
                var B = this.world.model.getBoundingBox();
                var BS = B.getSize();
                BS.y = 0;
                var max = 40;
                var i = max;
                var RND = new System.Random.ctor();
                var FC = [new BNTest.GLColor(1, 1, 0), new BNTest.GLColor(1, 0, 0), new BNTest.GLColor(1, 0, 1), new BNTest.GLColor(0, 0, 1)];
                var shrub = new BNTest.GLColor(0, 0.6, 0.1);
                //var rng = 1000;
                var rng = 800;
                var rng2 = (rng + rng) | 0;
                var range = new BNTest.GLVec3.ctor(rng2, -5, rng2);
                var hrange = new BNTest.GLVec3.ctor(rng, -15, rng);
                box.lastBB = BNTest.BoundingBox.op_Addition(new BNTest.BoundingBox.$ctor2(40), box.model.offset);
                while (i > 0) {
                    var V = BNTest.GLVec3.op_Subtraction(BNTest.GLVec3.random(range, RND), hrange);
                    //var Bnds = new BoundingBox(V-new GLVec3(-10,-10,-10), V + new GLVec3(40, 40, 40));
                    /* if (SafeForFoliage(V))
                        {
                            var rock = new Rock(world);
                            rock.Position = new GLVec3(V.X, rock.Position.Y, V.Z);
                            world.Add(rock);

                            //rock.LastBB = rock.GetBoundingBox();
                            rock.CacheBoundingBox();
                            F.AbsorbModel(rock.model);
                            rock.LastBB = rock.CustomBoundingBox + rock.Position;
                        }*/
                    //Bnds = new BoundingBox(V - new GLVec3(-10, -10, -10), V + new GLVec3(40, 40, 40));
                    V = BNTest.GLVec3.op_Subtraction(BNTest.GLVec3.random(range, RND), hrange);
                    if (this.safeForFoliage(V, true)) {
                        var tree = new BNTest.Tree(this.world);
                        tree.setPosition(new BNTest.GLVec3.ctor(V.x, tree.getPosition().y, V.z));
                        this.world.add(tree);

                        //tree.LastBB = tree.GetBoundingBox();
                        tree.cacheBoundingBox();
                        tree.lastBB = BNTest.BoundingBox.op_Addition(tree.customBoundingBox, tree.getPosition());
                        F.absorbModel$1(tree.model);
                    }
                    var fi = 7;
                    //fi = 2000;
                    while (fi > 0) {
                        V = BNTest.GLVec3.op_Subtraction(BNTest.GLVec3.random(range, RND), hrange);
                        if (this.safeForFoliage(V)) {
                            V.y = 7;
                            //F.AddPatch(V, FC.Pick(), 50, 0.25, 2);
                            //F.AddPatch(V, FC.Pick(), 30, 0.15, 2);
                            F.addFlower(V, BNTest.HelperExtensions.pick(BNTest.GLColor, FC), null, 2 + (Math.random() * 3));
                        }
                        fi = (fi - 1) | 0;
                    }
                    fi = 3;
                    /* while (fi > 0)
                        {
                            V = GLVec3.Random(range, RND) - hrange;
                            //if (world.FindSolidCollision(Bnds).Length <= 0)
                            if (SafeForFoliage(V))
                            {
                                V.Y = 7;
                                //F.AddShrub(V, shrub, 2.5+(Math.Random()*2.5));
                                F.AddShrub(V, shrub, 2.0 + (Math.Random() * 2.0));
                            }
                            fi--;
                        }*/
                    fi = 2;
                    while (fi > 0) {
                        V = BNTest.GLVec3.op_Subtraction(BNTest.GLVec3.random(range, RND), hrange);
                        //if (world.FindSolidCollision(Bnds).Length <= 0)
                        if (this.safeForFoliage(V)) {
                            //V.Y = 7;
                            V.y = 8;
                            //F.AddFlatShrub(V, shrub, 2.5 + (Math.Random() * 2.5));
                            F.addPatch(V, shrub, ((15 + Bridge.Int.clip32(Math.random() * 15)) | 0), 0.1 + (Math.random() * 0.2), 2.5 + (Math.random() * 2.5));
                        }
                        fi = (fi - 1) | 0;
                    }
                    i = (i - 1) | 0;
                }
                BNTest.AnimationLoader.get_this().asyncGet$1(["object/mushroom"], Bridge.fn.bind(this, function () {
                    var $t;
                    var OVM = BNTest.VoxelMap.fromImages$1("object/mushroom");
                    var pal = new (System.Collections.Generic.Dictionary$2(BNTest.GLColor,BNTest.GLColor))();
                    var C = new BNTest.GLColor();
                    var C2 = new BNTest.GLColor(1, 1, 1);
                    pal.set(new BNTest.GLColor(1, 0, 0), C);
                    pal.set(new BNTest.GLColor(1, 1, 1), C2);
                    i = (max * 2) | 0;
                    while (i > 0) {
                        var V1 = BNTest.GLVec3.op_Subtraction(BNTest.GLVec3.random(range, RND), hrange);
                        if (this.safeForFoliage(V1)) {
                            V1.y = 4;
                            C2.a = (C2.r = (C2.g = (C2.b = 1)));
                            C.setAhsb(Math.random(), Math.random(), Math.random());
                            if (Math.random() < 0.5) {
                                C2.copy(C);
                            }
                            var VM = OVM.clone();
                            VM.applyPalette(pal);
                            VM.addNoise(0.1 * Math.random());
                            var mod = new BNTest.Model(this);
                            var msh = new BNTest.Mesh(this);
                            msh.addVoxelMap(VM, true);
                            mod.meshes.add(msh);
                            mod.offset = V1;
                            mod.rotation.y = Math.random() * 360;
                            mod.scale.y *= 0.75 + (Math.random() * 0.7);
                            mod.scale.x = ($t = mod.scale.y * (0.75 + (Math.random() * 0.7)), mod.scale.z = $t, $t);
                            this.foliage.absorbModel$1(mod);
                        }
                        i = (i - 1) | 0;
                    }
                }));
                /* var rock = new Rock(world);
                    rock.Position = new GLVec3(-50, rock.Position.Y, -50);
                    world.Add(rock);*/

                //var CPU = new Player(true, true);

                //entities.Add(PC);
                //world.children.Add(PC.model);
                //Global.SetInterval(drawScene, 15);
            }
        },
        playMusic: function (song, volume) {
            if (volume === void 0) { volume = 1.0; }
            if (Bridge.referenceEquals(song, this.lastsong)) {
                return;
            }
            if (this.music != null) {
                this.music.stop();
            }
            this.music = BNTest.AudioManager.get_this().play(System.String.concat(System.String.concat("BGM/", song), ".ogg"), true);
            if (this.bGMMute) {
                this.music.setVolume(0);
            } else {
                this.music.setVolume(BNTest.MathHelper.clamp(this.bGMVolume) * BNTest.MathHelper.clamp(volume));
            }
            this.lastsong = song;
        },
        safeForFoliage: function (V, solid) {
            if (solid === void 0) { solid = false; }
            var Bnds = new BNTest.BoundingBox.$ctor1(BNTest.GLVec3.op_Subtraction(V, BNTest.GLVec3.createUniform(-25)), BNTest.GLVec3.op_Addition(V, BNTest.GLVec3.createUniform(80)));
            if (this.world.findSolidCollision(Bnds).length <= 0) {
                if (!solid) {
                    return true;
                }
                var VL = V.getRoughLength();
                if (VL >= 250 || Math.abs(V.z - 60) > 150) {
                    return true;
                }
            }
            return false;
        },
        setBarriers: function (box, thickness) {
            if (thickness === void 0) { thickness = 1; }
            var size = box.getSize();
            var B = new BNTest.Barrier(this.world, new BNTest.GLVec3.ctor(size.x, size.y, thickness));
            B.setPosition(BNTest.GLVec3.op_Addition(box.min, new BNTest.GLVec3.ctor(0, 0, 0)));
            this.world.add(B);

            B = new BNTest.Barrier(this.world, new BNTest.GLVec3.ctor(size.x, size.y, thickness));
            B.setPosition(BNTest.GLVec3.op_Addition(box.min, new BNTest.GLVec3.ctor(0, 0, size.z)));
            this.world.add(B);

            B = new BNTest.Barrier(this.world, new BNTest.GLVec3.ctor(thickness, size.y, size.z));
            B.setPosition(BNTest.GLVec3.op_Addition(box.min, new BNTest.GLVec3.ctor(size.x, 0, 0)));
            this.world.add(B);

            B = new BNTest.Barrier(this.world, new BNTest.GLVec3.ctor(thickness, size.y, size.z));
            B.setPosition(BNTest.GLVec3.op_Addition(box.min, new BNTest.GLVec3.ctor(0, 0, 0)));
            this.world.add(B);
        },
        addNPC: function () {
            /* var Char = "suika";
                if (NPCs % 6 == 5)
                {
                    Char = "cirno";
                }
                if (NPCs > 20 && NPCs % 8 == 7)
                {
                    if (NPCs % 24 == 23)
                    {
                        Char = "sakuya";
                    }
                    else
                    {
                        Char = "sanae";
                    }
                }*/
            var Char = "suika";
            if (this.nPCs >= this.enemyList.length) {
                return;
            } else {
                Char = this.enemyList[this.nPCs];
            }

            var NPC = new BNTest.PlayerCharacter(this.world, new BNTest.Player(true, true, true), Char);
            this.setNPC(NPC);
            this.world.add(NPC);
            this.nPCs = (this.nPCs + 1) | 0;
        },
        setNPC: function (NPC) {
            //float maxdist = 600;
            var maxdist = 500;
            var mindist = 250;
            var range = maxdist - mindist;
            var dist = mindist + (Math.random() * range);
            var V = BNTest.Vector2.op_Multiply(BNTest.Vector2.fromRadian(6.28 * Math.random()), dist);

            NPC.setx(V.x);
            //NPC.y = -100;
            NPC.sety(-500);
            NPC.setz(V.y);

            NPC.speed = new BNTest.GLVec3.ctor();

            NPC.setHP(100);
        },
        generateFloor: function () {
            var self = this;
            var FVM = BNTest.VoxelMap.gen(80, 2, 0, true, false, true);
            var msh = new BNTest.Mesh(self);
            msh.addVoxelMap(FVM, false, false, true);
            var floor = new BNTest.Entity(this.world);
            floor.model = new BNTest.Model(self);

            var $final = floor;


            var V;
            /* floor.y = 10;

                floor.Scale.X = 4;
                floor.Scale.Y = floor.Scale.X;
                floor.Scale.Z = floor.Scale.X;

                GLVec3 V = msh.Size * floor.Scale.X * 0.5;
                floor.x -= V.X;
                floor.z -= V.Z;
                floor.model.meshes.Add(msh);*/

            //floor.GetBoundingBox();



            //world.Add(floor);
            var size = 2;

            var x = (-size) | 0;
            var z = (-size) | 0;
            while (x <= size) {
                while (z <= size) {

                    /* FVM = VoxelMap.Gen(80, 2, 0, true, false, true);
                        msh = new Mesh(self);
                        msh.AddVoxelMap(FVM, false, false, true);*/
                    //msh = msh.Clone();
                    floor = new BNTest.Entity(this.world);
                    floor.model = new BNTest.Model(self);

                    //floor.groundFriction = 0.05;


                    floor.sety(10);

                    floor.getScale().x = 4;
                    floor.getScale().y = floor.getScale().x;
                    floor.getScale().z = floor.getScale().x;

                    //V = msh.Size * floor.Scale.X * 0.5;
                    V = BNTest.GLVec3.op_Multiply$1(new BNTest.GLVec3.ctor(40, 0, 40), floor.getScale().x);
                    floor.setx(-V.x);
                    floor.setz(-V.z);

                    floor.setx(floor.getx()+(V.x * (((x * 2) | 0))));
                    floor.setz(floor.getz()+(V.z * (((z * 2) | 0))));

                    /* floor.x -= V.X;
                        floor.z += V.Z;*/
                    floor.model.meshes.add(msh.clone());


                    //floor.GetBoundingBox();


                    floor.cacheBoundingBox();
                    this.world.add(floor);
                    this.foliage.absorbModel(floor);
                    //final.model.children.Add(floor.model);
                    z = (z + 1) | 0;
                }
                z = (-size) | 0;
                x = (x + 1) | 0;
            }
            var B = this.world.model.getBoundingBox();
            B.min.y -= 100;
            //B.Max.Y = 20;
            this.setBarriers(B, 5);
            //world.Add(final);
            //final.CacheBoundingBox();
            /* FVM = VoxelMap.Gen(100, 2, 0, true, false, true, true);
                msh = new Mesh(self);
                msh.AddVoxelMap(FVM, false, false, true);
                floor = new Entity(world);
                floor.model = new Model(self);

                floor.groundFriction = 0.05;


                floor.y = 10;

                floor.Scale.X = 4;
                floor.Scale.Y = floor.Scale.X;
                floor.Scale.Z = floor.Scale.X;

                V = msh.Size * floor.Scale.X * 0.5;
                floor.x -= V.X;
                floor.z += V.Z;
                floor.model.meshes.Add(msh);

                floor.GetBoundingBox();



                world.Add(floor);*/
        },
        setDepthFunc: function (DF) {
            this.gl.depthFunc(DF);
            this.theDepthFunc = DF;
        },
        setDepthTest: function (active) {
            if (this.depthTest !== active) {
                this.depthTest = active;
                if (active) {
                    this.gl.enable(this.gl.DEPTH_TEST);
                } else {
                    this.gl.disable(this.gl.DEPTH_TEST);
                }
            }
        },
        nextWave: function (skip) {
            if (skip === void 0) { skip = 10; }

            this.boss = null;
            this.localplayer.character.setHP(100);
            this.wave = (this.wave + 1) | 0;
            this.clearEntities();
            //bulletSpeedRate = defaultBulletSpeedRate + (wave * 0.02);
            this.bulletSpeedRate = this.defaultBulletSpeedRate + (this.wave * 0.022);
            this.bulletSpeedRate = Math.min(this.bulletSpeedRate, 2.5);
            this.waveDelay = this.maxWaveDelay;
            this.totaltime = 0;
            this.nPCs = 0;

            this.nextSpawn = -((this.nPCSpawntime - 1) * (((Bridge.Int.div(skip, 2)) | 0)));
            this.started = true;

            var basetime = 0.5;

            var DB = System.Linq.Enumerable.from(this.world.entities).ofType(BNTest.DonationBox).toArray()[0];
            DB.maxHP = DB.defaultMaxHP;
            this.nPCSpawntime = this.dNPCSpawntime;
            this.enemyList = System.Array.init(0, null);
            var L = this.enemyList;
            var D = 1;
            if (this.wave === 1) {
                BNTest.Helper.addMultiple(String, L, "suika", 15);
                BNTest.Helper.addMultiple(String, L, "cirno", 1);
                BNTest.Helper.addMultiple(String, L, "suika", 6);
                DB.maxHP = (DB.maxHP * 2) | 0;
                D = 1.2;
            } else if (this.wave === 2) {
                BNTest.Helper.addMultiple(String, L, "suika", 13);
                BNTest.Helper.addMultiple(String, L, "sanae", 2);
                BNTest.Helper.addMultiple(String, L, "suika", 8);
            } else if (this.wave === 3) {
                BNTest.Helper.addMultiple(String, L, "suika", 12);
                BNTest.Helper.addMultiple(String, L, "sanae", 2);
                BNTest.Helper.addMultiple(String, L, "cirno", 4);
                BNTest.Helper.addMultiple(String, L, "suika", 10);
            } else if (this.wave === 4) {
                BNTest.Helper.addMultiple(String, L, "suika", 12);
                BNTest.Helper.addMultiple(String, L, "sanae", 2);
                BNTest.Helper.addMultiple(String, L, "cirno", 4);
                BNTest.Helper.addMultiple(String, L, "suika", 10);
            } else if (this.wave === 5) {
                BNTest.Helper.addMultiple(String, L, "suika", 8);
                BNTest.Helper.addMultiple(String, L, "sanae", 1);
                BNTest.Helper.addMultiple(String, L, "cirno", 3);
                BNTest.Helper.addMultiple(String, L, "sanae", 2);
                BNTest.Helper.addMultiple(String, L, "suika", 4);
                BNTest.Helper.addMultiple(String, L, "cirno", 2);
                BNTest.Helper.addMultiple(String, L, "suika", 3);
            } else if (this.wave === 6) {
                BNTest.Helper.addMultiple(String, L, "suika", 10);
                D = 0.8;
                BNTest.Helper.addMultiple(String, L, "sakuya", 3);
                BNTest.Helper.addMultiple(String, L, "suika", 8);
            } else if (this.wave === 7) {
                BNTest.Helper.addMultiple(String, L, "suika", 7);
                BNTest.Helper.addMultiple(String, L, "sanae", 2);
                BNTest.Helper.addMultiple(String, L, "sakuya", 1);
                BNTest.Helper.addMultiple(String, L, "suika", 7);
                BNTest.Helper.addMultiple(String, L, "sakuya", 2);
            } else if (this.wave === 8) {
                D = 0.9;
                BNTest.Helper.addMultiple(String, L, "suika", 7);
                BNTest.Helper.addMultiple(String, L, "sanae", 1);
                BNTest.Helper.addMultiple(String, L, "sakuya", 2);
                BNTest.Helper.addMultiple(String, L, "sanae", 5);
                BNTest.Helper.addMultiple(String, L, "suika", 6);
            } else if (this.wave === 9) {
                D = 0.81;
                BNTest.Helper.addMultiple(String, L, "cirno", 27);
                basetime = 0.25;
            } else if (this.wave === 11) {
                D = 0.85;
                BNTest.Helper.addMultiple(String, L, "cirno", 3);
                BNTest.Helper.addMultiple(String, L, "suika", 4);
                BNTest.Helper.addMultiple(String, L, "sakuya", 2);
                BNTest.Helper.addMultiple(String, L, "sanae", 3);
                BNTest.Helper.addMultiple(String, L, "suika", 14);
            } else if (this.wave === 12) {
                D = 0.9;
                BNTest.Helper.addMultiple(String, L, "sanae", 4);
                BNTest.Helper.addMultiple(String, L, "suika", 12);
                BNTest.Helper.addMultiple(String, L, "aya", 1);
                BNTest.Helper.addMultiple(String, L, "suika", 6);
                BNTest.Helper.addMultiple(String, L, "aya", 1);
                BNTest.Helper.addMultiple(String, L, "suika", 4);
            } else if (this.wave === 13) {
                D = 0.35;
                BNTest.Helper.addMultiple(String, L, "suika", 50);
            } else if (this.wave === 14) {
                BNTest.Helper.addMultiple(String, L, "suika", 10);
                BNTest.Helper.addMultiple(String, L, "sakuya", 2);
                BNTest.Helper.addMultiple(String, L, "sanae", 1);
                BNTest.Helper.addMultiple(String, L, "suika", 2);
                BNTest.Helper.addMultiple(String, L, "youmu", 1);
                BNTest.Helper.addMultiple(String, L, "suika", 5);
                BNTest.Helper.addMultiple(String, L, "youmu", 1);
                BNTest.Helper.addMultiple(String, L, "suika", 7);
            } else if (this.wave === 18) {
                BNTest.Helper.addMultiple(String, L, "suika", 10);
                BNTest.Helper.addMultiple(String, L, "reisen", 2);
                BNTest.Helper.addMultiple(String, L, "sanae", 1);
                BNTest.Helper.addMultiple(String, L, "suika", 3);
                BNTest.Helper.addMultiple(String, L, "sakuya", 1);
                BNTest.Helper.addMultiple(String, L, "reisen", 1);
                BNTest.Helper.addMultiple(String, L, "suika", 6);
            } else if (this.wave > 0 && this.wave % 10 === 0) {
                var bosses = ["koishi", "marisa", "tenshi"];
                var Char = "";
                /* if (wave % 20==0)
                    {
                        Char = "marisa";
                    }*/
                var i = (Bridge.Int.div((((this.wave - 10) | 0)), 10)) | 0;
                while (i >= bosses.length) {
                    i = (i - bosses.length) | 0;
                }
                Char = bosses[i];
                var NPC = new BNTest.PlayerCharacter(this.world, new BNTest.Player(true, true), Char);
                NPC.defense = (12 + (((Bridge.Int.div(this.wave, 3)) | 0))) | 0;
                this.setNPC(NPC);
                this.world.add(NPC);
                this.boss = NPC;
                BNTest.Helper.addMultiple(String, L, "sanae", 1);
                BNTest.Helper.addMultiple(String, L, "cirno", 1);
                BNTest.Helper.addMultiple(String, L, "suika", 15);
            }

            if (L.length === 0) {
                this.doRandomWave();
            }
            this.nPCSpawntime *= D;
            var T = this.nPCSpawntime / 1000.0;
            //convert to minutes
            T /= 60;
            //since everything is spawned in pairs, halve the modifier.
            T *= 0.5;
            this.wavetime = ((((this.enemyList.length - skip) | 0)) * (T)) + basetime;
        },
        doRandomWave: function () {
            var difficulty = this.wave * 0.1;
            var max = Math.min(50, 20 + difficulty);
            var pool = System.Array.init(0, null);
            BNTest.Helper.addMultiple(String, pool, "suika", 60);
            BNTest.Helper.addMultiple(String, pool, "cirno", 12);
            BNTest.Helper.addMultiple(String, pool, "sanae", Bridge.Int.clip32(10 + (difficulty * 2)));
            BNTest.Helper.addMultiple(String, pool, "sakuya", Bridge.Int.clip32(4 + (difficulty * 1.6)));
            BNTest.Helper.addMultiple(String, pool, "aya", Bridge.Int.clip32(2 + (difficulty * 1.3)));
            BNTest.Helper.addMultiple(String, pool, "youmu", Bridge.Int.clip32(2 + (difficulty * 1.1)));
            if (this.wave > 20) {
                BNTest.Helper.addMultiple(String, pool, "reisen", Bridge.Int.clip32(2 + (difficulty * 1.1)));
            }
            var RND = new System.Random.ctor();
            var i = 0;
            while (i < max) {
                this.enemyList.push(BNTest.HelperExtensions.pick(String, pool, RND));
                i = (i + 1) | 0;
            }
        },
        updateControls: function () {
            var $t, $t1;
            if (BNTest.App.DEBUG) {
                this.updateDebug();
            }

            if (BNTest.KeyboardManager.get_this().tappedButtons.contains(77)) {
                if (this.music.getVolume() === 0) {
                    this.music.setVolume(this.bGMVolume);
                    this.bGMMute = false;
                } else {
                    this.music.setVolume(0);
                    this.bGMMute = true;
                }
            }
            if (BNTest.KeyboardManager.get_this().tappedButtons.contains(BNTest.GLDemo.VK_Enter) && BNTest.AnimationLoader.get_this().isIdle()) {
                if (this.ended) {
                    if (this.gameover) {
                        this.localplayer.lives = 3;
                        this.localplayer.character.setCoins(1000);

                        this.wave = 0;
                    }
                    BNTest.App.guiCanvas.style.opacity = "0.85";
                    this.titleRunning = false;
                    this.titlescreen = false;
                    this.world.add(this.localplayer.character);
                    this.localplayer.character.setPosition(new BNTest.GLVec3.ctor(0, -15, 0));
                    this.world.model.rotation.y = 0;
                    this.gameover = false;
                    this.ended = false;
                    this.playMusic("music");
                    this.localplayer.character.respawnPosition = this.localplayer.character.getPosition().clone();

                    this.nextWave();
                    this.clearEntities();
                } else {
                    this.paused = !this.paused;
                }
            }
            if (BNTest.KeyboardManager.get_this().tappedButtons.contains(48)) {
                this.radar.visible = !this.radar.visible;
            }
            if (BNTest.KeyboardManager.get_this().pressedButtons.contains(219) && (this.frame & 3) === 0) {
                this.radar.spriteBuffer.height = ($t = Math.min(((this.radar.spriteBuffer.width + 3) | 0), 500), this.radar.spriteBuffer.width = $t, $t);
            }
            if (BNTest.KeyboardManager.get_this().pressedButtons.contains(221) && (this.frame & 3) === 0) {
                this.radar.spriteBuffer.height = ($t1 = Math.max(((this.radar.spriteBuffer.width - 3) | 0), 15), this.radar.spriteBuffer.width = $t1, $t1);
            }

            var PC = this.localplayer.character;
            var threshhold = 0.7;
            var C = PC.controller;

            if (BNTest.App.IC == null) {
                return;
            }
            var x = BNTest.App.IC.getState(0);
            var y = BNTest.App.IC.getState(1);
            C[0] = x <= -threshhold;
            C[1] = x >= threshhold;
            C[2] = y <= -threshhold;
            C[3] = y >= threshhold;

            var cid = BNTest.App.IC.getMapControllerID$1(5);
            if (Bridge.referenceEquals(cid, "Keyboard") || Bridge.referenceEquals(cid, "Mouse")) {
                /* C[4] = KeyboardManager._this.PressedMouseButtons.Contains(0);
                    C[5] = KeyboardManager._this.PressedMouseButtons.Contains(2);*/
                C[4] = BNTest.App.IC.getPressed(2);
                C[5] = BNTest.App.IC.getPressed(3);
                C[6] = BNTest.App.IC.getPressed(4);
            } else {
                /* Vector2 aim = new Vector2(App.IC.getState(4), App.IC.getState(5));
                    if (aim.RoughLength > 0.5)
                    {
                        PC.aimAngle = aim.ToAngle();
                    }*/


            }
            C[4] = BNTest.App.IC.getPressed(2);
            C[5] = BNTest.App.IC.getPressed(3);
            C[6] = BNTest.App.IC.getPressed(4);
            /* C[4] = App.IC.getPressed(3);
                C[5] = App.IC.getPressed(4);*/

            var o = {  };
        },
        rotateTest: function (M, val) {
            if (val === void 0) { val = "x"; }
            if (M.Dir == null) {
                M.Dir = 1;
            }
            if (M.Max == null) {
                M.Max = 45;
            }
            if (M.Spd == null) {
                M.Spd = 1.5;
            }
            var max = System.Nullable.getValue(Bridge.cast(M.Max, System.Double));
            var spd = System.Nullable.getValue(Bridge.cast(M.Spd, System.Double));
            M.rotation[val] = System.Nullable.getValue(Bridge.cast(M.rotation[val], System.Double)) + (spd * System.Nullable.getValue(Bridge.cast(M.Dir, System.Double)));
            if (Math.abs(System.Nullable.getValue(Bridge.cast(M.rotation[val], System.Double))) >= max) {
                M.Dir = -System.Nullable.getValue(Bridge.cast(M.Dir, System.Double));
            }
        },
        initWebGL: function (canvas) {
            this.gl = null;

            try {
                this.gl = canvas.getContext("experimental-webgl");
            }
            catch (e) {
                e = System.Exception.create(e);
            }

            // If we don't have a GL context, give up now

            if (this.gl == null) {
                Bridge.global.alert("Unable to initialize WebGL. Your browser may not support it.");
            }
        },
        initBuffers: function () {

            // Create a buffer for the cube's vertices.

            this.cubeVerticesBuffer = this.gl.createBuffer();

            // Select the cubeVerticesBuffer as the one to apply vertex
            // operations to from here out.

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVerticesBuffer);

            // Now create an array of vertices for the cube.

            var vertices = [-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0];

            // Now pass the list of vertices into WebGL to build the shape. We
            // do this by creating a Float32Array from the JavaScript array,
            // then use it to fill the current vertex buffer.

            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

            // Now set up the colors for the faces. We'll use solid colors
            // for each face.
            //double[][] colors;
            var colors = [[1.0, 1.0, 1.0, 1.0], [1.0, 0.0, 0.0, 1.0], [0.0, 1.0, 0.0, 1.0], [0.0, 0.0, 1.0, 1.0], [1.0, 1.0, 0.0, 1.0], [1.0, 0.0, 1.0, 1.0]];
            //colors = Script.Write<double[][]>("cols.concat()");

            // Convert the array of colors into a table for all the vertices.

            var generatedColors = [];

            for (var j = 0; j < 6; j = (j + 1) | 0) {
                var c = colors[j];

                // Repeat each color four times for the four vertices of the face

                for (var i = 0; i < 4; i = (i + 1) | 0) {
                    generatedColors = generatedColors.concat(c);
                }
            }

            this.cubeVerticesColorBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVerticesColorBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(generatedColors), this.gl.STATIC_DRAW);

            // Build the element array buffer; this specifies the indices
            // into the vertex array for each face's vertices.

            this.cubeVerticesIndexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeVerticesIndexBuffer);

            // This array defines each face as two triangles, using the
            // indices into the vertex array to specify each triangle's
            // position.

            var cubeVertexIndices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];

            // Now send the element array to GL

            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), this.gl.STATIC_DRAW);

            /* mesh = new Mesh(gl);
                //mesh.AddCube(new GLVec3(-1, -1, -1), new GLVec3(1, 1, 1), new GLColor());
                //VoxelMap VM = VoxelMap.Gen(3);
                VoxelMap VM = VoxelMap.FromImages(AnimationLoader.Get("rahmoo"));
                mesh.AddVoxelMap(VM);*/
        },
        getVoxelCombo: function (assets) {
            if (assets == null || assets.length === 0) {
                return null;
            }
            //AnimationLoader.Get("head/base")
            var ret = null;
            var i = 0;
            var ok = true;
            //List<HTMLImageElement> last = null;
            /* while (i < assets.Length)
                {
                    AnimationLoader.Get(assets[i]);
                    i++;
                }
                i = 0;*/
            while (i < assets.length) {
                var A = BNTest.AnimationLoader.get(assets[i]);
                /* if (A.Count <= 0)
                    {
                        return null;
                    }*/
                if (A != null && A.getCount() > 0 && ok) {
                    var VM = BNTest.VoxelMap.fromImages(A);
                    if (ret == null) {
                        ret = VM;
                    } else if (VM != null) {
                        ret.combine(VM);
                    } else {
                        ret = null;
                        ok = false;
                    }
                } else {
                    ok = false;
                }
                //last = A;
                i = (i + 1) | 0;
            }
            return ret;
        },
        attack: function (target, source) {
            //if (target.HP > 0 && source.ontouchDamage(target))
            {
                target.BNTest$ICombatant$onDamaged(source, source.BNTest$IHarmfulEntity$gettouchDamage());
                target.playSound("hit");

                if (target.BNTest$ICombatant$getHP() <= 0) {
                    if (target.getHandledLocally()) {
                        var D = {  };
                        D.I = target.ID;
                        D.A = source.BNTest$IHarmfulEntity$getAttacker().ID;
                        D.S = source.ID;
                        this.sendEvent("Kill", D);
                    }
                }
            }
        },
        update: function (elapsedTime) {
            //var max = 50;
            //var max = 60;
            //if (totaltime > NextSpawn && NPCs<max && !ended && AnimationLoader._this.IsIdle())
            if (!this.paused) {
                if (this.waveDelay > 0) {
                    this.totaltime = 0;
                    this.waveDelay = (this.waveDelay - 1) | 0;
                } else {
                    if (this.totaltime > this.nextSpawn && !this.ended && BNTest.AnimationLoader.get_this().isIdle()) {
                        this.nextSpawn += this.nPCSpawntime;
                        var i = 2;
                        while (i > 0) {
                            this.addNPC();
                            i = (i - 1) | 0;
                        }
                    }
                }
                this.world.update();
            }
        },
        updateDebug: function () {
            if (BNTest.KeyboardManager.get_this().tappedButtons.contains(70)) {
                this.fogActive = !this.fogActive;
                this.gl.uniform1i(this.gl.getUniformLocation(this.shaderProgram, "uUseFog"), this.fogActive);
            }
            if (BNTest.KeyboardManager.get_this().tappedButtons.contains(82)) {
                BNTest.KeyboardManager.allowRightClick = !BNTest.KeyboardManager.allowRightClick;
            }
            if (BNTest.KeyboardManager.get_this().tappedButtons.contains(67)) {
                this.cameracontrols = !this.cameracontrols;
            }
            if (BNTest.KeyboardManager.get_this().tappedButtons.contains(66) && BNTest.AnimationLoader.get_this().isIdle() && !this.ended && this.boss == null) {
                var Char = "koishi";

                var NPC = new BNTest.PlayerCharacter(this.world, new BNTest.Player(true, true), Char);
                NPC.defense = (15 + this.wave) | 0;
                this.setNPC(NPC);
                this.world.add(NPC);
                this.boss = NPC;
                //NPCs++;
            }
            //if (KeyboardManager._this.TappedButtons.Contains(78) && !ended)
            if (BNTest.KeyboardManager.get_this().tappedButtons.contains(78) && !this.ended) {
                this.localplayer.character.setCoins((this.localplayer.character.getCoins() + 50) | 0);
                this.waveDelay = 0;
                this.wavetime = 0;
                this.nextWave();
            }
        },
        drawGauge: function (g, position, size, border, progress, color, drawborder) {
            if (drawborder === void 0) { drawborder = true; }
            if (drawborder) {
                g.globalAlpha = 0.6;
                g.fillStyle = "#000000";

                g.fillRect(position.x, position.y, size.x, size.y);
            }

            g.fillStyle = color;
            g.globalAlpha = 1.0;
            g.fillRect(((Bridge.Int.clip32(position.x) + border) | 0), ((Bridge.Int.clip32(position.y) + border) | 0), ((size.x - (((border + border) | 0))) * progress), ((Bridge.Int.clip32(size.y) - (((border + border) | 0))) | 0));

            g.globalAlpha = 0.5;
            var grd = g.createLinearGradient(0, 0, 0, size.y);grd.addColorStop(0, color);grd.addColorStop(0.4, "white");grd.addColorStop(1, color);g.fillStyle = grd;
            g.fillRect(((Bridge.Int.clip32(position.x) + border) | 0), ((Bridge.Int.clip32(position.y) + border) | 0), ((size.x - (((border + border) | 0))) * progress), ((Bridge.Int.clip32(size.y) - (((border + border) | 0))) | 0));
            g.globalAlpha = 1.0;
        },
        drawScene: function (elapsedTime) {
            //Global.SetTimeout(drawScene, 15);
            var self = this;
            //var callback = self["drawScene"];
            //var callback = Script.Write<object>("doDrawScene");
            //Action<double> callback = drawScene;
            //Script.Write("requestAnimationFrame(BNTest.GLDemo.doDrawScene)");
            //Global.RequestAnimationFrame(drawScene);
            this.gl.clearDepth(1);
            this.frame = (this.frame + 1) | 0;

            var V = BNTest.Vector2.op_Subtraction(BNTest.KeyboardManager.get_this().cMouse, new BNTest.Vector2(BNTest.App.canvas.width >> 1, BNTest.App.canvas.height >> 1));
            V.x *= 0.75;
            this.mouseAngle = V.toAngle();
            /* if (camera.Rotation.Y != 0)
                {
                    mouseAngle -= MathHelper.DegreesToRadians(camera.Rotation.Y.As<float>());
                }*/

            /* if (KeyboardManager._this.TappedButtons.Contains(KeyboardEvent.DOM_VK_S))
                {
                    smooth = !smooth;
                    //ReloadModel();

                    //Mesh.allowInterpolation = !Mesh.allowInterpolation;
                    CreateModel();
                }*/

            this.updateControls();
            //UpdateCollisions();
            var walking = false;
            if (this.world != null) {

                if (this.cameracontrols) {
                    if (BNTest.KeyboardManager.get_this().pressedMouseButtons.contains(0)) {
                        this.cameraDist *= 1.01;
                    }
                    if (BNTest.KeyboardManager.get_this().pressedMouseButtons.contains(1)) {
                        //mesh.Rotation.Z += 2;
                        this.camera.rotation.z += 2;
                    }
                    if (BNTest.KeyboardManager.get_this().pressedMouseButtons.contains(2)) {
                        this.cameraDist *= 0.99;
                    }
                    if (BNTest.KeyboardManager.get_this().mouseDelta !== 0) {
                        this.cameraDist *= (1 + (BNTest.KeyboardManager.get_this().mouseDelta * 0.05));
                    }
                }
                if (this.model != null) {
                    this.world.setOffset(BNTest.GLVec3.op_Multiply$1(this.model.offset, -1));
                }
                var spd = 0.8;
                var D = new BNTest.GLVec3.ctor();
                /* if (KeyboardManager._this.PressedButtons.Contains(KeyboardEvent.DOM_VK_DOWN))
                    {
                        model.Offset.Z += spd;
                        model.Rotation.Y = 0;
                        D.Y = 1;
                    }
                    if (KeyboardManager._this.PressedButtons.Contains(KeyboardEvent.DOM_VK_UP))
                    {
                        D.Y = -1;
                        model.Offset.Z -= spd;
                        model.Rotation.Y = 180;
                    }

                    if (KeyboardManager._this.PressedButtons.Contains(KeyboardEvent.DOM_VK_LEFT))
                    {
                        D.X = -1;
                        model.Rotation.Y = 90;
                        model.Offset.X -= spd;
                    }
                    if (KeyboardManager._this.PressedButtons.Contains(KeyboardEvent.DOM_VK_RIGHT))
                    {
                        D.X = 1;
                        model.Rotation.Y = 270;
                        model.Offset.X += spd;
                    }
                    walking = D.X != 0 || D.Y != 0;
                    if (Math.Abs(D.X) == Math.Abs(D.Y) && D.X!=0)
                    {
                        if (D.X == 1 && D.Y==-1)
                        {
                            model.Rotation.Y = 180+45;
                        }
                        if (D.X == 1 && D.Y == 1)
                        {
                            model.Rotation.Y = 0 - 45;
                        }

                        if (D.X == -1 && D.Y == -1)
                        {
                            model.Rotation.Y = 180 - 45;
                        }
                        if (D.X == -1 && D.Y == 1)
                        {
                            model.Rotation.Y = 0 + 45;
                        }
                    }
                    */
                //model.Scale = mesh.Scale;
            }
            BNTest.App.update();
            //initBuffers();
            // Clear the canvas before we start drawing on it.

            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            // Establish the perspective with which we want to view the
            // scene. Our field of view is 45 degrees, with a width/height
            // ratio of 640:480, and we only want to see objects between 0.1 units
            // and 100 units away from the camera.


            /* double znear = 0.1;
                double zfar = 10000.0;

                znear = cameraDist * 0.5;

                perspectiveMatrix = Script.Write<object>("makePerspective(45, 640.0 / 480.0, znear, zfar)");

                gl.UniformMatrix4fv(pUniform, false, Script.Write<Array>("new Float32Array(this.perspectiveMatrix.flatten())"));*/
            this.setPerspective();


            // Set the drawing position to the "identity" point, which is
            // the center of the scene.

            this.loadIdentity();

            // Now move the drawing position a bit to where we want to start
            // drawing the cube.

            //mvTranslate(Script.Write<object>("[-0.0, 0.0, -6.0]"));
            //mvTranslate(Script.Write<object>("[-0.0, 0.0, -26.0]"));
            //if (mesh != null)
            {
                //mvTranslate(new double[] { -0.0, 0.0, -26.0 * (1 / cameraDist) });
                this.mvTranslate([0.0, 0.0, -this.cameraDist]);
                if (this.fogActive) {
                    //gl.Uniform1f(gl.GetUniformLocation(shaderProgram, "uFogDensity"), 0.5 / cameraDist);
                    //var fog = 0.5;
                    var fog = 0.55;


                    fog /= this.cameraDist;
                    fog = fog * fog * 1.44;
                    this.gl.uniform1f(this.gl.getUniformLocation(this.shaderProgram, "uFogDensity"), fog);
                }
            }


            // Save the current matrix, then rotate before we draw.

            this.mvPushMatrix();
            //mvRotate(180, Script.Write<object>("[0, 0, 1]"));
            this.mvScale(new BNTest.GLVec3.ctor(1, -1, 1));
            //if (mesh != null)
            if (this.cameracontrols) {
                this.cubeRotation = -(BNTest.KeyboardManager.get_this().cMouse.x - 512) * 0.4;
                //mvRotate(cubeRotation, Script.Write<object>("[0, -1, 0]"));
                this.camera.rotation.y = this.cubeRotation;
                //mesh.Offset.X = -cubeRotation * 0.07;
                this.cubeRotation = (BNTest.KeyboardManager.get_this().cMouse.y - 384) * 0.4;
                //mvRotate(cubeRotation, Script.Write<object>("[-1, 0, 0]"));
                this.camera.rotation.x = this.cubeRotation;
                //mesh.Offset.Y = cubeRotation * 0.07;
            }


            this.mvTranslate([this.cubeXOffset, this.cubeYOffset, this.cubeZOffset]);

            // Draw the cube by binding the array buffer to the cube's vertices
            // array, setting attributes, and pushing it to GL.

            /* gl.BindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
                gl.VertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

                // Set the colors attribute for the vertices.

                gl.BindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
                gl.VertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

                // Draw the cube.

                gl.BindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);*/

            this.matrixNeedsFlush = true;
            /* if (model != null)
                {
                    var B = world.Entities[0].GetBoundingBox();
                    //if (!B.Contains(model.Offset + new GLVec3(0, 12, 0)))
                    BoundingBox MB = model.GetBoundingBox() + new GLVec3(0, 5.0, 0);
                    if (!B.Intersection(MB))
                    {
                        model.Offset.Y += 2.5;
                        //model.Rotation.X = -45;
                        model.Rotation.X = -22.5;
                        walking = false;
                    }
                    else
                    {
                        model.Rotation.X = 0;
                        model.Offset.Y = (B.Min.Y-11);
                    }
                    if (model.Offset.Y>200)
                    {
                        model.Offset.X = 0;
                        model.Offset.Y = -120;
                        model.Offset.Z = 0;
                        model.Rotation.X = 0;
                    }
                    if (walking)
                    {
                        //model.meshes[1].Rotation.X += 1;
                        //model.meshes[2].Rotation.X -= 1;
                        ///RotateTest(model.As<Mesh>());
                        ///
                        RotateTest(model.meshes[0]);

                        RotateTest(model.meshes[1]);
                        RotateTest(model.meshes[2]);

                        RotateTest(model.meshes[3]);
                        RotateTest(model.meshes[4]);

                        model.meshes[3].Offset.Z = -(model.meshes[3].Rotation.X * 0.025);
                        model.meshes[4].Offset.Z = -(model.meshes[4].Rotation.X * 0.025);
                

                        RotateTest(model.meshes[5],"y");
                    }
                
                    //model.Render();
                    //world.Render();
                    ///camera.Render();
                }*/
            if (this.titlescreen && !this.titleRunning && BNTest.AnimationLoader.get_this().isIdle()) {
                this.doTitle();
            }
            if (this.camera != null) {
                this.camera.render();
            }
            var testest = new BNTest.WGMatrix();
            testest.mvTranslate([100, 200, 300]);
            testest.mvScale(new BNTest.GLVec3.ctor(10, 10, 10));
            var test2 = new BNTest.WGMatrix();
            test2.setPositionThenScale(new BNTest.GLVec3.ctor(100, 200, 300), new BNTest.GLVec3.ctor(10, 10, 10));
            /* if (entities != null)
                {
                    int i = 0;
                    while (i < entities.Count)
                    {
                        var E = entities[i];
                        E.Update();
                        if (!E.Alive)
                        {
                            //entities.RemoveAt(i);
                            world.Remove(E);
                            i--;
                        }
                        i++;
                    }
                }*/
            if (this.titlescreen) {
                this.world.setOffset(new BNTest.GLVec3.ctor(0, 15, 0));
                this.world.model.rotation.y += 0.1;
            } else if (this.localplayer != null) {
                this.world.setOffset(BNTest.GLVec3.op_Multiply$1(this.localplayer.character.model.offset, -1));
                //localplayer.Character.Update();
            }
            if (this.started) {
                //mesh.Render();
            } else if (BNTest.AnimationLoader.get_this().queueEmpty()) {
                /* mesh = new Mesh(this);
                    VoxelMap VM = VoxelMap.FromImages(AnimationLoader.Get("rahmoo"));
                    mesh.AddVoxelMap(VM,true);*/
            }
            //gl.DrawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

            // Restore the original matrix

            this.mvPopMatrix();

            // Update the rotation for the next draw, if it's time to do so.

            var currentTime = (new Date()).getTime();
            //var D = new Date();
            //var currentTime = D.GetSeconds() + (D.GetMilliseconds() * 0.001);
            if (this.lastCubeUpdateTime != null && this.lastCubeUpdateTime > 0) {
                var delta = currentTime - this.lastCubeUpdateTime;
                this.cubeRotation += (30 * delta) / 1000.0;
                /* cubeRotation += (30 * delta) / 1000.0;
                    cubeXOffset += xIncValue * ((30 * delta) / 1000.0);
                    cubeYOffset += yIncValue * ((30 * delta) / 1000.0);
                    cubeZOffset += zIncValue * ((30 * delta) / 1000.0);

                    if (Math.Abs(cubeYOffset) > 2.5)
                    {
                        xIncValue = -xIncValue;
                        yIncValue = -yIncValue;
                        zIncValue = -zIncValue;
                    }*/
            }
            this.updateGui();
            this.lastCubeUpdateTime = currentTime;
        },
        setPerspective: function (znearRate) {
            if (znearRate === void 0) { znearRate = 0.325; }
            var ZN = this.cameraDist * znearRate;
            if (this.perspectiveMatrix != null && this.cameraDist === this.lastCameraDist && ZN === this.lastZnear) {
                return;
            }
            var znear = 0.1;
            var zfar = 10000.0;

            //znear = cameraDist * 0.5;
            znear = ZN;

            this.perspectiveMatrix = makePerspective(45, 640.0 / 480.0, znear, zfar);
            var flat = this.tflat;
            this.flatten$1(this.perspectiveMatrix, flat);
            var A = new Float32Array(flat);

            this.gl.uniformMatrix4fv(this.pUniform, false, A);
            this.lastZnear = ZN;
            //gl.UniformMatrix4fv(pUniform, false, Script.Write<Array>("new Float32Array(this.perspectiveMatrix.flatten())"));
        },
        /**
         * removes enemies,coins and projectiles.
         *
         * @instance
         * @public
         * @this BNTest.GLDemo
         * @memberof BNTest.GLDemo
         * @param   {boolean}    coins
         * @return  {void}
         */
        clearEntities: function (coins) {
            if (coins === void 0) { coins = false; }
            BNTest.HelperExtensions.forEach(BNTest.Entity, this.world.entities, function (E) {
                if ((Bridge.is(E, BNTest.PlayerCharacter) && Bridge.cast(E, BNTest.PlayerCharacter).me.CPU) || (coins && Bridge.is(E, BNTest.Coin)) || Bridge.is(E, BNTest.Projectile)) {
                    E.alive = false;
                }
            });
            this.boss = null;
        },
        doTitle: function () {
            this.titleRunning = true;
            this.paused = false;
            this.world.remove(this.localplayer.character);
            this.localplayer.character.visible = false;
            var i = 0;
            while (i < 30) {
                var Char = "suika";

                var NPC = new BNTest.PlayerCharacter(this.world, new BNTest.Player(true, true, true), Char);
                this.setNPC(NPC);
                this.world.add(NPC);
                this.nPCs = (this.nPCs + 1) | 0;
                NPC.getBehavior(BNTest.NavigatorAI).canJump = false;
                NPC.getBehavior(BNTest.AimedWandering).enabled = false;
                var W = NPC.getBehavior(BNTest.WanderAI);
                W.framesPerTick = (15 + Bridge.Int.clip32(Math.random() * 20)) | 0;
                W.range *= 2;
                W.chance = 0.6;
                i = (i + 1) | 0;
            }
            this.playMusic("titlescreen", 0.6);
        },
        updateGui: function () {


            var tt = Bridge.Int.clip32(this.totaltime * 0.001);
            var max = this.wavetime * 60;
            var tim = Bridge.Int.clip32(max - tt);
            var done = tim < 0 && !this.ended;
            if (this.boss != null) {
                done = this.boss.getHP() <= 0 || this.boss.respawnTime > 0;
            }
            if (done) {
                //do game end stuff.
                //ended = true;
                //ClearEntities();
                this.nextWave();
            }
            if ((this.localplayer.character.getCoins() <= 0 || this.localplayer.lives < 0 || BNTest.KeyboardManager.get_this().pressedButtons.contains(27)) && !this.gameover) {
                //game over
                this.gameover = true;
                if (BNTest.KeyboardManager.get_this().pressedButtons.contains(27)) {
                    //gameover = false;
                }
                this.ended = true;
                this.clearEntities(true);
                this.totaltime = 0;
                this.titlescreen = true;
                BNTest.App.guiCanvas.style.opacity = "1";
                //PlayMusic("titlescreen");
                if (this.localplayer.character.respawnTime > 0) {
                    this.localplayer.character.respawnTime = 0;
                }
            }
            tim = Math.max(0, tim);
            var s = tim % 60;
            var m = (((Bridge.Int.div(tim, 60)) | 0)) % 60;
            var time = System.String.concat(System.String.concat(System.String.alignString((System.String.concat("", m)), 2, 48), ":"), System.String.alignString((System.String.concat("", s)), 2, 48));
            if (tim < 11) {
                time = System.String.concat("", s);
            }
            var pad = 50;
            if (this.ended) {

                if (BNTest.AnimationLoader.get_this().isIdle()) {
                    if (!this.gameover) {
                        time = "Press Enter to start";
                    } else {
                        if (tt < 20) {
                            if (this.localplayer.character.getCoins() <= 0) {
                                time = "No more coins, Game Over!";
                            } else if (this.localplayer.lives < 0) {
                                time = "No more lives, Game Over!";
                            } else {
                                time = "Game ended";
                            }
                        } else {
                            time = "Press Enter to restart";
                        }
                    }
                } else {
                    time = "Assets are being loaded, please wait...";
                }
            } else if (this.boss != null) {
                time = System.String.concat(System.String.concat(String.fromCharCode(this.boss.char.charCodeAt(0)).toUpperCase(), this.boss.char.substr(1)), ":");
            }
            //pad = 50 - (time.Length >> 1);
            pad = (66 - (time.length >> 1)) | 0;
            //var time = "5:00";
            var gui = BNTest.App.gui;
            gui.clearRect(0, 0, 1024, 1024);
            if (this.titlescreen) {
                gui.fillStyle = "#220077";
                gui.globalAlpha = 0.5;
                gui.fillRect(0, 0, 1024, 1024);
                gui.globalAlpha = 1.0;

                var QS = BNTest.AnimationLoader.get_this().queueSize();
                this.maxLoadQueue = Math.max(this.maxLoadQueue, QS);
                if (QS > 0) {
                    var loaded = (this.maxLoadQueue - QS) | 0;
                    this.maxLoadProgress = loaded / this.maxLoadQueue;
                    //loadProgress += ((maxLoadProgress - loadProgress) * 0.005) + 0.01;
                    //loadProgress = MathHelper.Lerp(loadProgress,maxLoadProgress,0.1);
                    this.loadProgress = BNTest.MathHelper.lerp(this.loadProgress, this.maxLoadProgress, 0.07);
                    this.loadProgress = Math.min(this.loadProgress, this.maxLoadQueue, 1);
                    this.drawGauge(gui, new BNTest.Vector2(350, 42), new BNTest.Vector2(320, 24), 2, this.loadProgress, "#00DD00");
                }
            }

            gui.lineWidth = 3.0;
            if (this.started) {
                //DrawGauge(gui, new Vector2(800, 2), new Vector2(220, 32), 3, (float)Math.Max(0, localplayer.Character.HP / 100.0), "#00DD00");
                this.drawGauge(gui, new BNTest.Vector2(2, 2), new BNTest.Vector2(220, 32), 3, Math.max(0, this.localplayer.character.getHP() / 100.0), "#00DD00");
                if (this.boss != null) {
                    //DrawGauge(gui, new Vector2(350, 40), new Vector2(220, 32), 3, (float)Math.Max(0, boss.HP / 100.0), "#00DD00");
                    this.drawGauge(gui, new BNTest.Vector2(350, 42), new BNTest.Vector2(320, 24), 2, Math.max(0, this.boss.getHP() / 100.0), "#00DD00");
                }
                if (!this.ended && this.radar.visible) {
                    var rg = this.radar.getGraphics();
                    var rsz = this.radar.spriteBuffer.width;
                    var hrsz = (Bridge.Int.div(rsz, 2)) | 0;

                    rg.clearRect(0, 0, rsz, rsz);
                    rg.globalAlpha = 0.6;
                    rg.beginPath();
                    rg.arc(hrsz, hrsz, hrsz, 0, 2 * Math.PI, false);
                    rg.fillStyle = "#005500";
                    rg.fill();
                    rg.lineWidth = 3;
                    rg.strokeStyle = "#002200";
                    rg.stroke();
                    rg.globalAlpha = 1;
                    var i = 0;
                    var LE = this.world.entities;
                    var ln = LE.getCount();
                    var P = this.localplayer.character.getPosition().toVector2();
                    //var scale = 0.08f;
                    var scale = 0.1;
                    var Y = this.localplayer.character.gety();
                    var team = this.localplayer.character.team;

                    while (i < ln) {
                        var E = LE.getItem(i);
                        var D = E;
                        var color = "#00FF00";
                        var ok = false;
                        var sz = 5;
                        var MY = 50;
                        if (D.me) {
                            ok = true;
                            if (!Bridge.referenceEquals(D.team, team)) {
                                color = "#FF0000";
                            }
                        }
                        var A = E.getAttacker;
                        if (A) {
                            A = E.getAttacker();
                            if (A && A.me) {
                                ok = true;
                                sz = 3;
                                MY = 8;
                                if (!Bridge.referenceEquals(A.team, team)) {
                                    color = "#FF0000";
                                }
                            }
                        } else if (E.value) {
                            ok = true;
                            color = "#FFFF00";
                        } else if (E.defaultMaxHP) {
                            ok = true;
                            color = "#00FFFF";
                            sz = 9;
                        }

                        if (ok) {
                            if (E.model != null && (E.model.alpha < 0.15 || !E.model.getVisible())) {
                                //don't show invisible units.
                                ok = false;
                            }
                            if (Math.abs(E.getPosition().y - Y) > MY) {
                                ok = false;
                            }
                            if (Bridge.referenceEquals(E, this.localplayer.character)) {
                                color = "#FFFFFF";
                                ok = true;
                                sz = (sz + 2) | 0;
                            }
                            if (ok) {
                                var V = BNTest.Vector2.op_Subtraction(E.getPosition().toVector2(), P);
                                V.x *= scale;
                                V.y *= scale;
                                rg.fillStyle = color;
                                var L = V.getLength();
                                if (L > hrsz) {
                                    V = V.normalize(hrsz);
                                    L = hrsz;
                                }
                                if (L <= hrsz) {
                                    var hsz = (sz >> 1);
                                    rg.fillRect((V.x + hrsz - hsz), (V.y + hrsz - hsz), sz, sz);
                                }
                            }
                        }
                        i = (i + 1) | 0;
                    }
                    //gui.GlobalAlpha = 0.75f;
                    gui.globalAlpha = 0.9;
                    //Radar.Position = new Vector2(1019 - rsz, 4);
                    var off = 40;
                    this.radar.position = new BNTest.Vector2((1023 - (off / BNTest.App.targetAspect)) - rsz, off);
                    this.radar.draw(gui);
                    gui.globalAlpha = 1;
                }
            }
            this.TS.setTextColor("#FFFFFF");
            this.TS.setShadowOffset(new BNTest.Vector2(3, 3));
            //TS.FontSize = 30;
            this.TS.setFontSize(26);
            this.TS.setShadowBlur(5);
            this.TS.setShadowColor("#000000");
            //TS.ShadowOffset = new Vector2(10, 10);
            /* var T = "Coins:" + localplayer.Character.Coins;
                T = T.PadRight(pad,' ') + time + "\nLives:"+Math.Max(localplayer.lives,0)+" Wave:" + wave;
                if (!started)
                {
                    T = "".PadRight(pad, ' ') + time;
                }*/
            var T = System.String.concat(System.String.alignString((""), -pad, 32), time);
            if (this.started) {
                T = System.String.concat(System.String.concat(System.String.concat(System.String.concat(System.String.concat(System.String.concat(System.String.concat(T, "\n"), "Coins:"), this.localplayer.character.getCoins()), "\nLives:"), Math.max(this.localplayer.lives, 0)), " Wave:"), this.wave);
            }
            this.TS.setText(T);
            //TS.Position = new Vector2(2, 2);
            this.TS.position = new BNTest.Vector2(2, -4);
            this.TS.draw(gui);


            var C = "#FFFFFF";

            var fs = 60;
            var SB = 7;

            var SC = "#000000";

            T = "";
            var TX = 300;
            var TY = 150;
            /* if (gameover)
                {
                    C = "#FF0000";
                    T = "Game Over!";
                    LTS.Alpha = 1;
                }
                else */
            if (this.titlescreen) {
                fs = (fs + 10) | 0;
                C = "#FF0000";
                T = BNTest.App.gameName;
                this.LTS.alpha = 1;
                //SC = "#0055FF";
                SC = "#FFFFFF";
                //TX -= 120;
                TX = (TX - 20) | 0;
                SB = 8;

                this.BTS.setTextColor("#FFFFFF");
                this.BTS.setFontSize(18);
                this.BTS.setText(System.String.concat(System.String.alignString(("Graphics and Code by:RSGmaker"), -100, 32), "Touhou Project is owned by ZUN"));
                this.BTS.position = new BNTest.Vector2(50, 720);
                this.BTS.setShadowOffset(new BNTest.Vector2(3, 3));
                this.BTS.setShadowBlur(3);
                this.BTS.setShadowColor("#000000");
                this.BTS.draw(gui);

                //VTS.Position = LTS.Position + new Vector2(600, 95);
                this.VTS.position = new BNTest.Vector2(763, 98 + this.LTS.position.y);
                this.VTS.draw(gui);
            } else if (this.paused) {
                this.LTS.alpha = 1;
                //C = "#DDDD33";
                C = "#EEEE88";
                T = "Paused";
                fs = (fs + 10) | 0;
                TX = (TX + 65) | 0;
                TY = (TY + 25) | 0;
                SB = 8;
            } else if (this.waveDelay > 0) {
                T = System.String.concat("Wave ", this.wave);
                fs = (120 - Bridge.Int.clip32(this.waveDelay * 0.35)) | 0;
                //LTS.Alpha = (WaveDelay * 0.004f);
                this.LTS.alpha = (this.waveDelay * 0.005);
                if (fs < 1) {
                    fs = 1;
                }
            }
            if (!Bridge.referenceEquals(T, "")) {
                this.LTS.setShadowOffset(new BNTest.Vector2(3, 3));
                this.LTS.setShadowBlur(SB);
                this.LTS.setShadowColor(SC);
                this.LTS.setFontSize(fs);
                this.LTS.setTextColor(C);
                this.LTS.position = new BNTest.Vector2(TX, TY);
                this.LTS.setText(T);
                this.LTS.draw(gui);
            }


        },
        getTeamColor: function (Team) {
            return new BNTest.GLColor();
        },
        playSoundEffect: function (position, sound) {
            var vol = 1.0;
            /* float min = 640;
                float maxLength = 320;*/
            //float min = 700;
            var min = 450;
            var maxLength = 1600;
            if (position != null) {
                var dist = (BNTest.GLVec3.op_Subtraction(this.world.cam, position)).getRoughLength();
                //float dist = (world.Offset - position).Length;
                dist -= min;
                if (dist > 0) {
                    if (dist >= maxLength) {
                        //volume of 0, just don't play it.
                        return;
                    } else {
                        vol = 1.0 - (dist / maxLength);
                    }
                }
            }
            BNTest.AudioManager.get_this().blast(System.String.concat(System.String.concat("SFX/", sound), ".ogg"), vol);
        },
        sendEvent: function (type, data, flush) {
            if (flush === void 0) { flush = false; }
            var D = {  };
            D.E = type;
            D.D = data;
            var NU = null;
            if (this.online) {
                /* NP.Send(D);
                    NU = NP.Me;*/
            }
            this.processEvent(D, NU, 0);
            if (flush) {
                this.netPlayNeedsFlush = true;
            }
        },
        processEvent: function (msg, user, latency) {
            var LP = new (System.Collections.Generic.List$1(BNTest.Player))(System.Linq.Enumerable.from(this.players).where(function (player) {
                return user != null && Bridge.referenceEquals(player.networkID, user.userID);
            }));
            var P = null;
            var D = msg.D;
            var hascharacter = true;
            if (LP.getCount() <= 0) {
                if (P == null && user == null && !this.online) {
                    P = this.localplayer;
                } else {
                    if (user.getIsMe()) {
                        this.localplayer.networkID = user.userID;
                        P = this.localplayer;
                    } else {
                        hascharacter = false;
                    }
                }
            } else {
                P = LP.getItem(0);
            }
            var evt = msg.E;
            if (user != null && !user.getIsMe()) {
                this.dlatency += latency;
                //latency *= 0.99f;
                this.dlatency *= (1 - (1 / this.latencyM));
            }

            if (Bridge.referenceEquals(evt, "Kill")) {
                var entity = this.entityFromID(D.I);
                if (entity != null && entity.getHP() <= 0) {
                    var attacker = this.entityFromID(D.A);
                    entity.BNTest$ICombatant$onDeath(this.entityFromID(D.S));
                    if (attacker != null && Bridge.is(attacker, BNTest.PlayerCharacter)) {
                        var PC = attacker;
                        PC.me.score = (PC.me.score + entity.BNTest$ICombatant$getPointsForKilling()) | 0;
                        PC.onKill(entity);
                    }
                }
            }
        },
        entityFromID: function (ID) {
            var LE = System.Linq.Enumerable.from(this.world.entities).where(function (E) {
                return Bridge.referenceEquals(E.ID, ID);
            }).toList(BNTest.Entity);
            if (LE.getCount() > 0) {
                return LE.getItem(0);
            }
            return null;
        },
        initShaders: function () {
            var fragmentShader = this.getShader(this.gl, "Bshader-fs");
            var vertexShader = this.getShader(this.gl, "Bshader-vs");

            // Create the shader program

            this.shaderProgram = this.gl.createProgram();
            this.gl.attachShader(this.shaderProgram, vertexShader);
            this.gl.attachShader(this.shaderProgram, fragmentShader);
            this.gl.linkProgram(this.shaderProgram);

            // If creating the shader program failed, alert

            if (this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS) == null) {
                Bridge.global.alert(System.String.concat("Unable to initialize the shader program: ", this.gl.getProgramInfoLog(this.shaderProgram)));
            }

            this.gl.useProgram(this.shaderProgram);

            this.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
            this.gl.enableVertexAttribArray(this.vertexPositionAttribute);

            this.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
            this.gl.enableVertexAttribArray(this.vertexColorAttribute);

            this.vertexTextureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
            this.samplerUniform = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
            this.enableTextures();

            this.gl.uniform1i(this.gl.getUniformLocation(this.shaderProgram, "uUseFog"), false);
            this.gl.uniform1f(this.gl.getUniformLocation(this.shaderProgram, "uFogDensity"), 0.01);

            this.alphaUniform = this.gl.getUniformLocation(this.shaderProgram, "uAlpha");

            this.colorUniform = this.gl.getUniformLocation(this.shaderProgram, "uPColor");

            this.pUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");

            this.mvUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");

            this.fogActive = true;
            this.gl.uniform1i(this.gl.getUniformLocation(this.shaderProgram, "uUseFog"), this.fogActive);
            this.gl.uniform1f(this.alphaUniform, 1);


            var CV = document.createElement('canvas');
            var sz = 32;
            var hsz = (Bridge.Int.div(sz, 2)) | 0;
            CV.width = sz;
            CV.height = sz;
            var G = BNTest.Helper.getContext(CV);
            G.fillStyle = "#FF00FF";

            G.fillRect(0, 0, sz, sz);
            G.fillStyle = "#00FFFF";
            G.fillRect(0, 0, hsz, hsz);
            G.fillRect(hsz, hsz, hsz, hsz);

            //G.FillStyle = "#FFFFFF";
            //G.FillRect(0, 0, 4, 4);
            var img = new Image();
            img.src = CV.toDataURL();
            var texture = this.gl.createTexture();

            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);

            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.uniform1i(this.samplerUniform, 0);

            var self = this;
            //AnimationLoader._this.AsyncGet("test", s => test(self),true);

            //gl.Uniform4f(gl.GetUniformLocation(shaderProgram, "uPColor"),1,1,1,1);


            this.disableTextures();
            BNTest.Mesh.init(this.vertexPositionAttribute, this.vertexColorAttribute, this.vertexTextureCoordAttribute);
        },
        pushAlpha: function (alpha) {
            this.alphalist.push(this.currentAlpha);
            /* if (currentAlpha == 1 && alpha<1)
                {
                    gl.DepthFunc(gl.GREATER);
                }*/
            alpha = Math.min(Math.max(alpha, 0), 1);
            this.currentAlpha *= alpha;
            this.gl.uniform1f(this.alphaUniform, this.currentAlpha);


            /* if (currentAlpha<1 && depthTest)
                {
                    SetDepthTest(false);
                }*/
        },
        popAlpha: function () {
            var alpha = this.alphalist.pop();
            /* if (currentAlpha < 1 && alpha == 1)
                {
                    gl.DepthFunc(gl.LEQUAL);
                }*/
            this.currentAlpha = alpha;
            this.gl.uniform1f(this.alphaUniform, this.currentAlpha);
        },
        setTexture: function (texture) {
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.uniform1i(this.samplerUniform, 0);
        },
        enableTextures: function () {
            this.gl.enableVertexAttribArray(this.vertexTextureCoordAttribute);
            this.gl.uniform4f(this.colorUniform, 0, 0, 0, 0);
            BNTest.Mesh.texture = true;
        },
        disableTextures: function () {
            this.gl.disableVertexAttribArray(this.vertexTextureCoordAttribute);
            this.gl.uniform4f(this.colorUniform, 1, 1, 1, 1);
            BNTest.Mesh.texture = false;
        },
        setColor: function (color) {
            this.gl.uniform4f(this.colorUniform, color.r, color.g, color.b, color.a);
        },
        resetColor: function () {
            if (!BNTest.Mesh.texture) {
                this.gl.uniform4f(this.colorUniform, 1, 1, 1, 1);
            } else {
                this.gl.uniform4f(this.colorUniform, 0, 0, 0, 0);
            }
        },
        _test: function () {

            var timg = BNTest.AnimationLoader.get("test").getItem(0);
            var img = new Image();
            img.src = timg.src;
            /* Document.Body.RemoveChild(App.Div);
                Document.Body.AppendChild(img);*/

            var texture = this.gl.createTexture();

            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);


            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.uniform1i(this.samplerUniform, 0);
        },
        getShader: function (gl, id) {

            var shaderScript = document.getElementById(id);

            // Didn't find an element with the specified ID; abort.

            if (shaderScript == null) {
                return null;
            }

            // Walk through the source element's children, building the
            // shader source string.

            var theSource = "";
            var currentChild = shaderScript.firstChild;

            while (currentChild != null) {
                if (currentChild.nodeType === 3) {
                    theSource = System.String.concat(theSource, currentChild.textContent);
                }

                currentChild = currentChild.nextSibling;
            }

            // Now figure out what type of shader script we have,
            // based on its MIME type.

            var shader;

            var st = shaderScript.type;

            if (Bridge.referenceEquals(st, "x-shader/x-fragment")) {
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            } else if (Bridge.referenceEquals(st, "x-shader/x-vertex")) {
                shader = gl.createShader(gl.VERTEX_SHADER);
            } else {
                return null; // Unknown shader type
            }

            // Send the source to the shader object

            gl.shaderSource(shader, theSource);

            // Compile the shader program

            gl.compileShader(shader);

            // See if it compiled successfully

            if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) == null) {
                Bridge.global.alert(System.String.concat("An error occurred compiling the shaders: ", gl.getShaderInfoLog(shader)));
                return null;
            }

            return shader;
        },
        loadIdentity: function () {
            this.mvMatrix = Matrix.I(4);
            this.matrix.mvMatrix = this.mvMatrix;

            this.matrix.mvMatrixStack = System.Array.init(0, null);
        },
        multMatrix: function (m, flush) {
            if (flush === void 0) { flush = false; }
            //WGMatrix.MultMatrix(mvMatrix, m);
            this.matrix.multiplyMatrix$1(m);

            this.matrixNeedsFlush = true;
            /* if (flush)
                    setMatrixUniforms();*/
        },
        mvTranslate: function (v) {
            //Script.Write("this.multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());");
            this.matrix.mvTranslate(v);
        },
        flushMatrix: function () {
            if (this.matrixNeedsFlush) {
                this.matrixNeedsFlush = false;
                //setMatrixUniforms();
                var flat = this.tflat;
                this.flatten$1(this.mvMatrix, flat);
                var A = new Float32Array(flat);
                //var B = Script.Write<Array>("new Float32Array(this.mvMatrix.flatten())");
                //var A = Script.Write<Array>("new Float32Array(this.mvMatrix.flatten())");
                this.gl.uniformMatrix4fv(this.mvUniform, false, A);
            }
        },
        flatten: function (matrix) {
            var M = matrix.elements;
            return [M[0][0], M[1][0], M[2][0], M[3][0], M[0][1], M[1][1], M[2][1], M[3][1], M[0][2], M[1][2], M[2][2], M[3][2], M[0][3], M[1][3], M[2][3], M[3][3]];
        },
        flatten$1: function (matrix, OUT) {
            var M = matrix.elements;
            var O = OUT;
            /* var i = 0;
                var x = 0;
                var y = 0;*/
            O[0] = M[0][0];
            O[1] = M[1][0];
            O[2] = M[2][0];
            O[3] = M[3][0];

            O[4] = M[0][1];
            O[5] = M[1][1];
            O[6] = M[2][1];
            O[7] = M[3][1];

            O[8] = M[0][2];
            O[9] = M[1][2];
            O[10] = M[2][2];
            O[11] = M[3][2];

            O[12] = M[0][3];
            O[13] = M[1][3];
            O[14] = M[2][3];
            O[15] = M[3][3];
            /* return new double[] { M[0][0], M[1][0], M[2][0], M[3][0],
                    M[0][1], M[1][1], M[2][1], M[3][1],
                    M[0][2], M[1][2], M[2][2], M[3][2],
                    M[0][3], M[1][3], M[2][3], M[3][3]
                };*/
        },
        mvPushMatrix: function (m) {
            if (m === void 0) { m = null; }
            this.matrixNeedsFlush = true;
            this.matrix.mvPushMatrix();
            return;
            if (m != null) {
                this.mvMatrixStack.push(m.dup());
                this.mvMatrix = m.dup();
            } else {
                this.mvMatrixStack.push(this.mvMatrix.dup());
            }
            this.matrixNeedsFlush = true;
        },
        mvPopMatrix: function () {
            this.matrixNeedsFlush = true;
            return this.matrix.mvPopMatrix();

            if (!this.mvMatrixStack.length) {
                throw ("Can't pop from an empty matrix stack.");
            }

            this.mvMatrix = this.mvMatrixStack.pop();
            //mvMatrix = Script.Write<object>("mvMatrixStack.pop()");
            this.matrixNeedsFlush = true;
            return this.mvMatrix;
        },
        mvScale: function (Scale) {
            this.matrix.mvScale(Scale);
            return;

            var s = Scale;
            var m = Matrix.I(4);
            var me = m.elements;
            me[0][0]=s.x;
            me[1][1]=s.y;
            me[2][2]=s.z;
            this.multMatrix(m);
        }
    });

    Bridge.define("BNTest.GLVec3", {
        statics: {
            getOne: function () {
                return new BNTest.GLVec3.ctor(1, 1, 1);
            },
            mean: function (L) {
                if (L === void 0) { L = []; }
                var V = new BNTest.GLVec3.ctor();
                var i = 0;
                while (i < L.length) {
                    var V2 = L[i];
                    V.x += V2.x;
                    V.y += V2.y;
                    V.z += V2.z;
                    i = (i + 1) | 0;
                }
                V.x /= L.length;
                V.y /= L.length;
                V.z /= L.length;
                return V;
            },
            lerp: function (V1, V2, D) {
                return new BNTest.GLVec3.ctor(BNTest.MathHelper.lerp(V1.x, V2.x, D), BNTest.MathHelper.lerp(V1.y, V2.y, D), BNTest.MathHelper.lerp(V1.z, V2.z, D));
            },
            transform: function (V, M, inv) {
                if (inv === void 0) { inv = false; }
                return BNTest.GLVec3.transformB(V.toVec3(), M.mvMatrix, inv);

                /* WGMatrix W = new WGMatrix();
                W.SetTranslation(V);
                W.multMatrix(M.mvMatrix);
                //return new GLVec3();
                return W.GetTranslation();*/



                //var T = new double[] { V.X,V.Y,V.Z};
                //var NV = Vec3.Create();
                /* var NV = V.ToVec3();
                //Vec3.Normalize(T, NV.As<double[][][]>());

                //var ret = Vec3.Create();
                var ret = new GLVec3().ToVec3();
                Vec3.TransformMat4(ret.As<double[][][]>(), NV.As<double[][][]>(), (double[])M.mvMatrix);
                double[] RR = new double[4];
                Mat4.GetTranslation(RR, (double[])M.mvMatrix);
                return new GLVec3(RR[0], RR[1], RR[2]);*/
                //return new GLVec3(ret[0][0], ret[1][1], ret[2][2]);
            },
            transformB: function (a, m, inv) {
                if (inv === void 0) { inv = false; }
                var ret = System.Array.init(3, 0);

                var OM = m;
                var me = m.elements;
                //me.ForEach<double[]>(D => m.Push(D));
                if (!inv) {
                    m = BNTest.WGMatrix.flattenB(m);
                } else {
                    m = BNTest.WGMatrix.flatten(m);
                }
                /* m = Script.Write<double[]>("[]");
                me.ForEach<double[]>(D => D.ForEach<double>(L => m.Push(L)));*/


                /* double x = a[0], y = a[1], z = a[2],
                    w = m[3] * x + m[7] * y + m[11] * z + m[15];
                w = 1;
        ret[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
        ret[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
        ret[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;*/

                var x = a[0], y = a[1], z = a[2];
                ret[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]);
                ret[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]);
                ret[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]);
                return new BNTest.GLVec3.ctor(ret[0], ret[1], ret[2]);
            },
            random: function (length, RND) {
                if (RND === void 0) { RND = null; }
                if (RND == null) {
                    RND = new System.Random.ctor();
                }
                return new BNTest.GLVec3.ctor(RND.nextDouble() * length.x, RND.nextDouble() * length.y, RND.nextDouble() * length.z);
            },
            createUniform: function (D) {
                return new BNTest.GLVec3.ctor(D, D, D);
            },
            min: function (V1, V2) {
                return new BNTest.GLVec3.ctor(Math.min(V1.x, V2.x), Math.min(V1.y, V2.y), Math.min(V1.z, V2.z));
            },
            max: function (V1, V2) {
                return new BNTest.GLVec3.ctor(Math.max(V1.x, V2.x), Math.max(V1.y, V2.y), Math.max(V1.z, V2.z));
            },
            floor: function (V) {
                return new BNTest.GLVec3.ctor(Math.floor(V.x), Math.floor(V.y), Math.floor(V.z));
            },
            getCenter: function (V1, V2) {
                //return V1 + ((V2 - V1) * 0.5);
                var X = V1.x + ((V2.x - V1.x) * 0.5);
                var Y = V1.y + ((V2.y - V1.y) * 0.5);
                var Z = V1.z + ((V2.z - V1.z) * 0.5);
                return new BNTest.GLVec3.ctor(X, Y, Z);
            },
            op_Addition$1: function (V1, Vec2) {
                /* var V2 = new GLVec3(Vec2.X, 0, Vec2.Y);
                return new GLVec3(V1.X + V2.X, V1.Y + V2.Y, V1.Z + V2.Z);*/
                return new BNTest.GLVec3.ctor(V1.x + Vec2.x, V1.y, V1.z + Vec2.y);
            },
            op_Addition: function (V1, V2) {
                return new BNTest.GLVec3.ctor(V1.x + V2.x, V1.y + V2.y, V1.z + V2.z);
            },
            op_Subtraction: function (V1, V2) {
                return new BNTest.GLVec3.ctor(V1.x - V2.x, V1.y - V2.y, V1.z - V2.z);
            },
            op_UnaryNegation: function (V) {
                return new BNTest.GLVec3.ctor(-V.x, -V.y, -V.z);
                //return new GLVec3(V1.X - V2.X, V1.Y - V2.Y, V1.Z - V2.Z);
            },
            op_Multiply: function (V1, V2) {
                return new BNTest.GLVec3.ctor(V1.x * V2.x, V1.y * V2.y, V1.z * V2.z);
            },
            op_Multiply$1: function (V1, scale) {
                return new BNTest.GLVec3.ctor(V1.x * scale, V1.y * scale, V1.z * scale);
            },
            op_Division: function (V1, V2) {
                return new BNTest.GLVec3.ctor(V1.x / V2.x, V1.y / V2.y, V1.z / V2.z);
            },
            op_Division$1: function (V1, scale) {
                return new BNTest.GLVec3.ctor(V1.x / scale, V1.y / scale, V1.z / scale);
            },
            op_LessThan: function (V1, V2) {
                return (V1.x < V2.x && V1.y < V2.y && V1.z < V2.z);
            },
            op_GreaterThan: function (V1, V2) {
                return (V1.x > V2.x && V1.y > V2.y && V1.z > V2.z);
            },
            op_LessThanOrEqual: function (V1, V2) {
                return (V1.x <= V2.x && V1.y <= V2.y && V1.z <= V2.z);
            },
            op_GreaterThanOrEqual: function (V1, V2) {
                return (V1.x >= V2.x && V1.y >= V2.y && V1.z >= V2.z);
            }
        },
        x: 0,
        y: 0,
        z: 0,
        $ctor1: function (vec3) {
            this.$initialize();
            this.x = vec3[0];
            this.y = vec3[1];
            this.z = vec3[2];
        },
        ctor: function (X, Y, Z) {
            if (X === void 0) { X = 0.0; }
            if (Y === void 0) { Y = 0.0; }
            if (Z === void 0) { Z = 0.0; }

            this.$initialize();
            this.x = X;
            this.y = Y;
            this.z = Z;
        },
        getLength: function () {
            return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
        },
        /**
         * Returns a rough estimate of the vector's length.
         *
         * @instance
         * @public
         * @this BNTest.GLVec3
         * @memberof BNTest.GLVec3
         * @function getEstimatedLength
         * @return  {number}
         */
        /**
         * Returns a rough estimate of the vector's length.
         *
         * @instance
         * @function setEstimatedLength
         */
        getEstimatedLength: function () {
            var A = Math.abs(this.x);
            var B = Math.abs(this.y);
            var C = Math.abs(this.z);

            var M = Math.max(A, B, C);
            var D = 0.34;
            if ((A === M && B === M) || (B === M && C === M) || (A === M && C === M)) {
                //If multiple elements are equivalent, do a different estimation method.
                D += 0.15;
                M = -1;
            }
            //B *= 0.34;
            if (A !== M) {
                A *= D;
            }
            if (B !== M) {
                B *= D;
            }
            if (C !== M) {
                C *= D;
            }
            return (A + B + C);
            //return (float)(Math.Abs(X) + Math.Abs(Y));
        },
        getRoughLength: function () {
            return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
        },
        syncCopy: function (V, dimension) {
            if (dimension === void 0) { dimension = 0; }
            var X = this.x;
            var Y = this.y;
            var Z = this.z;
            if (dimension === 0) {
                X = V.x;
            } else if (dimension === 1) {
                Y = V.y;
            } else if (dimension === 2) {
                Z = V.z;
            }
            return new BNTest.GLVec3.ctor(X, Y, Z);
        },
        roughDistance: function (V) {
            return Math.abs(this.x - V.x) + Math.abs(this.y - V.y) + Math.abs(this.z - V.z);
        },
        toVec3: function () {

            //var ret = Script.Write<double[]>("new glMatrix.ARRAY_TYPE(3)");
            var ret = System.Array.init(3, 0);
            ret[0] = this.x;
            ret[1] = this.y;
            ret[2] = this.z;
            return ret;
        },
        normalize: function (length) {
            if (length === void 0) { length = 1.0; }
            /* double distance = Math.Sqrt(X * X + Y * Y + Z * Z);
                GLVec3 V = new GLVec3();
                V.X = X / distance;
                V.Y = Y / distance;
                V.Z = Z / distance;
                V.X *= length;
                V.Y *= length;
                V.Z *= length;
                return V;*/

            var D = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z) / length;
            var V = new BNTest.GLVec3.ctor();
            V.x = this.x / D;
            V.y = this.y / D;
            V.z = this.z / D;
            return V;
        },
        equals: function (o) {
            return o != null && (o.x === this.x && o.y === this.y && o.z === this.z);
        },
        toVector2: function () {
            return new BNTest.Vector2(this.x, this.z);
        },
        clone: function () {
            return new BNTest.GLVec3.ctor(this.x, this.y, this.z);
        },
        toString: function () {
            return System.String.concat(System.String.concat(System.String.concat(System.String.concat(System.String.concat("X:", System.Double.format(this.x, 'G')), " Y:"), System.Double.format(this.y, 'G')), " Z:"), System.Double.format(this.z, 'G'));
            //return base.ToString();
        }
    });

    Bridge.define("BNTest.Helper", {
        statics: {
            _namespaces: null,
            config: {
                init: function () {
                    this._namespaces = new (System.Collections.Generic.Dictionary$2(String,Object))();
                }
            },
            getRandomString: function () {
                //return (Math.Random() * new Date().GetTime()).ToString(36).Replace("/\\./ g, '-'",null);
                //return (Math.Random() * new Date().GetTime()).ToString(36).Replace(new Bridge.Text.RegularExpressions.Regex("", null);
                //return Script.Write<string>("(Math.random() * new Date().getTime()).toString(36).replace(/\\./ g, '-')");
                return (Math.random() * new Date().getTime()).toString(36);
            },
            getType: function (FullName) {
                var name = FullName;
                if (Bridge.referenceEquals(name, "") || name == null || !System.String.contains(name,".")) {
                    return null;
                }
                var s = name.split(".");
                //string nm = GetType().FullName.Split(".")[0];
                var i = 1;
                /* if (s[0] != nm)
                    return null;*/

                //dynamic obj = Script.Write<object>(nm);

                //Get namespace
                var obj;
                if (BNTest.Helper._namespaces.containsKey(s[0])) {
                    obj = BNTest.Helper._namespaces.get(s[0]);
                } else {
                    obj = eval(s[0]);
                    BNTest.Helper._namespaces.set(s[0], obj);
                }

                while (i < s.length) {
                    //Parse through object hierarchy.
                    if (!obj) {
                        return null;
                    }
                    obj = obj[s[i]];
                    i = (i + 1) | 0;
                }
                return obj;
            },
            addMultiple: function (T, array, item, number) {
                while (number > 0) {
                    array.push(item);
                    number = (number - 1) | 0;
                }
            },
            cloneCanvas: function (C) {
                var ret = document.createElement('canvas');
                ret.width = C.width;
                ret.height = C.height;
                var g = ret.getContext("2d");
                g.drawImage(C, 0.0, 0.0);
                return ret;
            },
            getContext: function (C) {
                return C.getContext("2d");
            },
            getField: function (target, fieldName) {
                var O = target;
                //if (O[fieldName])
                if (BNTest.Helper.has(O, fieldName)) {
                    return O[fieldName];
                }
                if (O[System.String.concat("get", fieldName)]) {
                    return O[System.String.concat("get", fieldName)]();
                }
                var s = "";
                try {
                    s = System.String.concat(System.String.concat(System.String.concat("Helper get field: Field \"", fieldName), "\" was not in ") + target.GetType().FullName, ".");
                }
                catch ($e1) {
                    $e1 = System.Exception.create($e1);
                    s = System.String.concat(System.String.concat(System.String.concat("Helper get field: Field \"", fieldName), "\" was not in ") + target, ".");
                }

                //Console.WriteLine(s);
                console.log(s);
                return null;
            },
            has: function (target, fieldName) {
                /* if (O[fieldName] || ((string)O) == "false")
                {
                    return true;
                }*/
                return typeof target[fieldName] != 'undefined';
            },
            reloadPage: function () {
                window.location.href = window.location.href;
            },
            setField: function (target, fieldName, data) {
                var O = target;
                //if (O[fieldName])
                if (BNTest.Helper.has(O, fieldName)) {
                    O[fieldName] = data;
                    return;
                }
                if (O[System.String.concat("set", fieldName)]) {
                    O[System.String.concat("set", fieldName)](data);
                    return;
                }
                var s = "";
                try {
                    s = System.String.concat(System.String.concat(System.String.concat("Helper set field: Field \"", fieldName), "\" was not in ") + target.GetType().FullName, ".");
                }
                catch ($e1) {
                    $e1 = System.Exception.create($e1);
                    s = System.String.concat(System.String.concat(System.String.concat("Helper set field: Field \"", fieldName), "\" was not in ") + target, ".");
                }
                //Console.WriteLine(s);
                console.log(s);
            },
            copyFields: function (source, target, Fields) {
                if (Fields === void 0) { Fields = null; }
                if (Fields == null) {
                    Fields = Object.keys(source);
                }
                var i = 0;
                while (i < Fields.length) {
                    var f = Fields[i];
                    BNTest.Helper.setField(target, f, BNTest.Helper.getField(source, f));
                    i = (i + 1) | 0;
                }
            },
            keyCodeToString: function (keycode) {
                var codenames = ["", "", "", "CANCEL", "", "", "HELP", "", "BACK_SPACE", "TAB", "", "", "CLEAR", "ENTER", "ENTER_SPECIAL", "", "SHIFT", "CONTROL", "ALT", "PAUSE", "CAPS_LOCK", "KANA", "EISU", "JUNJA", "FINAL", "HANJA", "", "ESCAPE", "CONVERT", "NONCONVERT", "ACCEPT", "MODECHANGE", "SPACE", "PAGE_UP", "PAGE_DOWN", "END", "HOME", "LEFT", "UP", "RIGHT", "DOWN", "SELECT", "PRINT", "EXECUTE", "PRINTSCREEN", "INSERT", "DELETE", "", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "COLON", "SEMICOLON", "LESS_THAN", "EQUALS", "GREATER_THAN", "QUESTION_MARK", "AT", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "OS_KEY", "", "CONTEXT_MENU", "", "SLEEP", "NUMPAD0", "NUMPAD1", "NUMPAD2", "NUMPAD3", "NUMPAD4", "NUMPAD5", "NUMPAD6", "NUMPAD7", "NUMPAD8", "NUMPAD9", "MULTIPLY", "ADD", "SEPARATOR", "SUBTRACT", "DECIMAL", "DIVIDE", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24", "", "", "", "", "", "", "", "", "NUM_LOCK", "SCROLL_LOCK", "WIN_OEM_FJ_JISHO", "WIN_OEM_FJ_MASSHOU", "WIN_OEM_FJ_TOUROKU", "WIN_OEM_FJ_LOYA", "WIN_OEM_FJ_ROYA", "", "", "", "", "", "", "", "", "", "CIRCUMFLEX", "EXCLAMATION", "DOUBLE_QUOTE", "HASH", "DOLLAR", "PERCENT", "AMPERSAND", "UNDERSCORE", "OPEN_PAREN", "CLOSE_PAREN", "ASTERISK", "PLUS", "PIPE", "HYPHEN_MINUS", "OPEN_CURLY_BRACKET", "CLOSE_CURLY_BRACKET", "TILDE", "", "", "", "", "VOLUME_MUTE", "VOLUME_DOWN", "VOLUME_UP", "", "", "SEMICOLON", "EQUALS", "COMMA", "MINUS", "PERIOD", "SLASH", "BACK_QUOTE", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "OPEN_BRACKET", "BACK_SLASH", "CLOSE_BRACKET", "QUOTE", "", "META", "ALTGR", "", "WIN_ICO_HELP", "WIN_ICO_00", "", "WIN_ICO_CLEAR", "", "", "WIN_OEM_RESET", "WIN_OEM_JUMP", "WIN_OEM_PA1", "WIN_OEM_PA2", "WIN_OEM_PA3", "WIN_OEM_WSCTRL", "WIN_OEM_CUSEL", "WIN_OEM_ATTN", "WIN_OEM_FINISH", "WIN_OEM_COPY", "WIN_OEM_AUTO", "WIN_OEM_ENLW", "WIN_OEM_BACKTAB", "ATTN", "CRSEL", "EXSEL", "EREOF", "PLAY", "ZOOM", "", "PA1", "WIN_OEM_CLEAR", ""];
                if (keycode >= 0 && keycode < codenames.length) {
                    return codenames[keycode];
                }
                return String.fromCharCode(keycode);
            },
            makeShallowCopy: function (source, fieldNames) {
                if (fieldNames === void 0) { fieldNames = null; }
                var target = {  };
                var Fields = fieldNames;
                if (Fields == null) {
                    Fields = Object.keys(source);
                }
                var i = 0;
                while (i < Fields.length) {
                    var f = Fields[i];
                    target[f] = BNTest.Helper.getField(source, f);
                    i = (i + 1) | 0;
                }
                return target;
            }
        }
    });

    Bridge.define("BNTest.HelperExtensions", {
        statics: {
            pick: function (T, list, RND) {
                var $t;
                if (RND === void 0) { RND = null; }
                if (RND == null) {
                    RND = new System.Random.ctor();
                }
                var L = new (System.Collections.Generic.List$1(T))();
                $t = Bridge.getEnumerator(list);
                while ($t.moveNext()) {
                    var item = $t.getCurrent();
                    L.add(item);
                }
                return L.getItem(RND.next$1(L.getCount()));
            },
            forEach: function (T, list, action) {
                var $t;
                $t = Bridge.getEnumerator(list);
                while ($t.moveNext()) {
                    var item = $t.getCurrent();
                    action(item);
                }
            },
            forEach$1: function (T, list, methodName) {
                var $t;
                $t = Bridge.getEnumerator(list);
                while ($t.moveNext()) {
                    var item = $t.getCurrent();
                    var A = item[methodName];
                    A();
                }
            },
            addIfNew: function (T, list, item) {
                if (!list.contains(item)) {
                    list.add(item);
                }
            },
            removeAll: function (T, list, predicate) {

                //foreach (var item in list)
                var i = 0;
                while (i < list.getCount()) {
                    var item = list.getItem(i);
                    //action(item);
                    if (predicate(item)) {
                        //list.rem
                        list.remove(item);
                        i = (i - 1) | 0;
                    }
                    i = (i + 1) | 0;
                }
            },
            pushIfNew: function (T, list, val) {
                if (!System.Array.contains(list, val, T)) {
                    list.push(val);
                }
            },
            pushRange: function (T, list, val) {
                if (val === void 0) { val = []; }
                var i = 0;
                while (i < val.length) {
                    list.push(val[i]);
                    i = (i + 1) | 0;
                }
            }
        }
    });

    Bridge.define("BNTest.ICombatant", {
        $kind: "interface"
    });

    Bridge.define("BNTest.IHarmfulEntity", {
        $kind: "interface"
    });

    Bridge.define("BNTest.InputController", {
        statics: {
            numberOfActions: 8,
            GM: null
        },
        inputMapping: null,
        config: {
            properties: {
                id: null
            }
        },
        ctor: function (id) {
            if (id === void 0) { id = "Keyboard"; }

            this.$initialize();
            this.setid(id);
            this.inputMapping = new (System.Collections.Generic.List$1(BNTest.InputMap))();

            if (Bridge.referenceEquals(id, "Keyboard")) {
                this.initkeyboard();
            } else if (Bridge.referenceEquals(id, "KeyboardMouse")) {
                this.setid("Keyboard");
                this.initkeyboardmouse();
            } else {
                this.initgamepad();
            }
            if (BNTest.InputController.GM == null) {
                if (BNTest.GamePadManager._this == null) {
                    BNTest.GamePadManager._this = new BNTest.GamePadManager();
                }
                BNTest.InputController.GM = BNTest.GamePadManager._this;
            }
        },
        copyMap: function () {
            /* dynamic D = new object();
                return D;*/
            var fields = ["map", "antimap", "name", "axis", "controllerID"];
            var ret = System.Array.init(this.inputMapping.getCount(), null);
            var i = 0;
            while (i < ret.length) {
                ret[i] = BNTest.Helper.makeShallowCopy(this.inputMapping.getItem(i), fields);
                i = (i + 1) | 0;
            }
            return ret;
        },
        copyFromMap: function (Map) {
            var fields = ["map", "antimap", "name", "axis", "controllerID"];

            var i = 0;
            while (i < Map.length) {
                if (i >= this.inputMapping.getCount()) {
                    this.inputMapping.add(new BNTest.InputMap.ctor());
                }
                var IM = this.inputMapping.getItem(i);
                BNTest.Helper.copyFields(Map[i], IM, fields);
                //ret[i] = Helper.MakeShallowCopy(InputMapping[i], fields);
                i = (i + 1) | 0;
            }
        },
        initkeyboardmouse: function () {
            var i = 0;
            while (i < BNTest.InputController.numberOfActions) {
                var map = new BNTest.InputMap.$ctor1(-1);
                if (i === 0) {
                    /* map.map = 39;
                        map.antimap = 37;*/

                    map.map = 68;
                    map.antimap = 65;
                }
                if (i === 1) {
                    /* map.map = 40;
                        map.antimap = 38;*/

                    map.map = 83;
                    map.antimap = 87;
                }
                if (i === 2) {
                    map.map = 32;
                }
                if (i === 3) {
                    map.map = 0;
                    map.controllerID = "Mouse";
                }
                if (i === 4) {
                    map.map = 2;
                    map.controllerID = "Mouse";
                }
                /* 
                    if (i == 3)
                    {
                        map.map = 90;
                    }
                    if (i == 4)
                    {
                        map.map = 88;
                    }*/
                if (i === 5) {
                    map.map = 13;
                }
                this.inputMapping.add(map);
                i = (i + 1) | 0;
            }
        },
        initkeyboard: function () {
            var i = 0;
            while (i < BNTest.InputController.numberOfActions) {
                var map = new BNTest.InputMap.$ctor1(-1);
                if (i === 0) {
                    /* map.map = 39;
                        map.antimap = 37;*/

                    map.map = 68;
                    map.antimap = 65;
                }
                if (i === 1) {
                    /* map.map = 40;
                        map.antimap = 38;*/

                    map.map = 83;
                    map.antimap = 87;
                }

                if (i === 2) {
                    map.map = 32;
                }
                if (i === 3) {
                    map.map = 90;
                }
                if (i === 4) {
                    map.map = 88;
                }
                if (i === 5) {
                    map.map = 13;
                }
                this.inputMapping.add(map);
                i = (i + 1) | 0;
            }
        },
        initgamepad: function () {
            var i = 0;
            while (i < BNTest.InputController.numberOfActions) {
                var map = new BNTest.InputMap.$ctor1(-1);
                if (i === 0) {
                    map.map = 0;
                    map.axis = true;
                }
                if (i === 1) {
                    map.map = 1;
                    map.axis = true;
                }

                if (i > 1) {
                    map.map = (i - 2) | 0;
                }
                this.inputMapping.add(map);
                i = (i + 1) | 0;
            }
        },
        getState: function (action, map) {
            if (map === void 0) { map = null; }
            if (map == null) {
                map = this.inputMapping.getItem(action);
            }
            /* InputController IC = this;
                if (map.controller != null)
                {
                    IC = map.controller;
                }*/
            var TID = this.getid();
            if (!Bridge.referenceEquals(map.controllerID, "")) {
                TID = map.controllerID;
            }

            if (Bridge.referenceEquals(TID, "Keyboard")) {
                return this.getKeyboardMapState(map);
            } else if (Bridge.referenceEquals(TID, "Mouse")) {
                return this.getMouseMapState(map);
            } else {
                return this.getGamepadMapState(map);
            }
            return 0;
        },
        getPressed: function (action, map) {
            if (map === void 0) { map = null; }
            return this.getState(action, map) >= 0.7;
        },
        findAnyPressedGamePadInput: function () {
            var ret = new BNTest.InputMap.ctor();
            var L = BNTest.GamePadManager._this.getactiveGamepads();
            BNTest.HelperExtensions.forEach(BNTest.GamePad, L, function (G) {
                if (ret.map === -1) {
                    ret.controllerID = G.id;
                    var GB = System.Linq.Enumerable.from(G.buttons).where($_.BNTest.InputController.f1).toArray();
                    if (GB.length > 0) {
                        ret.axis = false;
                        var tmp = GB[0];
                        ret.map = new (System.Collections.Generic.List$1(BNTest.GamePadButton))(G.buttons).indexOf(tmp);
                    } else {
                        var i = 0;
                        while (i < G.axes.length && ret.map === -1) {
                            if (Math.abs(G.axes[i]) > 0.7 && Math.abs(G.axes[i]) < 2.0) {
                                ret.axis = true;
                                ret.map = i;
                                if (G.axes[i] < 0) {
                                    ret.name = "anti";
                                    ret.antimap = i;
                                }
                            }
                            i = (i + 1) | 0;
                        }
                    }
                }
            });
            if (ret.map !== -1) {
                return ret;
            }
            return null;
        },
        getMapControllerID: function (map) {
            if (!Bridge.referenceEquals(map.controllerID, "")) {
                return map.controllerID;
            } else {
                return this.getid();
            }
        },
        getMapControllerID$1: function (action) {
            return this.getMapControllerID(this.inputMapping.getItem(action));
        },
        getGamepadMapState: function (map) {
            var TID = this.getid();
            if (!Bridge.referenceEquals(map.controllerID, "")) {
                TID = map.controllerID;
            }
            var P = BNTest.GamePadManager._this.getPad(TID);
            if (P == null || !P.connected) {
                return 0;
            }
            if (!map.axis) {
                if (P.buttons[map.map].pressed) {
                    return 1;
                } else if (map.antimap >= 0 && P.buttons[map.antimap].pressed) {
                    return -1;
                }
                return 0;
            } else {
                return P.axes[map.map];
            }
        },
        getKeyboardMapState: function (map) {
            var L = BNTest.KeyboardManager.get_this().pressedButtons;
            if (L.contains(map.map)) {
                return 1.0;
            } else if (L.contains(map.antimap)) {
                return -1.0;
            }
            return 0;
        },
        getMouseMapState: function (map) {
            var L = BNTest.KeyboardManager.get_this().pressedMouseButtons;
            if (L.contains(map.map)) {
                return 1.0;
            } else if (L.contains(map.antimap)) {
                return -1.0;
            }
            return 0;
        }
    });

    Bridge.ns("BNTest.InputController", $_);

    Bridge.apply($_.BNTest.InputController, {
        f1: function (B) {
            return B.pressed;
        }
    });

    Bridge.define("BNTest.InputControllerManager", {
        statics: {
            __this: null,
            get_this: function () {
                if (BNTest.InputControllerManager.__this == null) {
                    BNTest.InputControllerManager.__this = new BNTest.InputControllerManager();
                }
                return BNTest.InputControllerManager.__this;
            },
            init: function () {
                if (BNTest.InputControllerManager.__this == null) {
                    BNTest.InputControllerManager.__this = new BNTest.InputControllerManager();
                }
            }
        },
        controllers: null,
        ctor: function () {
            this.$initialize();
            this.controllers = new (System.Collections.Generic.List$1(BNTest.InputController))();

            this.controllers.add(new BNTest.InputController());
            var gamepads = BNTest.GamePadManager._this.getactiveGamepads();
            var i = 0;
            while (i < gamepads.getCount()) {
                this.controllers.add(new BNTest.InputController(gamepads.getItem(i).id));
                i = (i + 1) | 0;
            }
        }
    });

    Bridge.define("BNTest.InputMap", {
        map: -1,
        antimap: -1,
        name: "",
        axis: false,
        controllerID: "",
        ctor: function () {
            this.$initialize();
            this.axis = false;
        },
        $ctor1: function (map, antimap, axis) {
            if (antimap === void 0) { antimap = -1; }
            if (axis === void 0) { axis = false; }

            this.$initialize();
            this.map = map;
            this.antimap = antimap;
            this.axis = axis;
        }
    });

    Bridge.define("BNTest.KeyboardManager", {
        statics: {
            allowRightClick: false,
            __this: null,
            get_this: function () {
                if (BNTest.KeyboardManager.__this == null) {
                    BNTest.KeyboardManager.__this = new BNTest.KeyboardManager();
                }
                return BNTest.KeyboardManager.__this;
            },
            init: function () {
                if (BNTest.KeyboardManager.__this == null) {
                    BNTest.KeyboardManager.__this = new BNTest.KeyboardManager();
                }
            },
            update: function () {
                BNTest.KeyboardManager.__this.tappedButtons.clear();
                BNTest.KeyboardManager.__this.tappedMouseButtons.clear();
                BNTest.KeyboardManager.__this.mouseDelta = 0;
            },
            neverinBounds: function (evt) {
                return BNTest.KeyboardManager.allowRightClick || !BNTest.App.screenBounds.containsPoint$1(BNTest.KeyboardManager.get_this().cMouse.x, BNTest.KeyboardManager.get_this().cMouse.y);
            },
            onKeyDown: function (evt) {
                var keyCode = evt.keyCode;

                if (!BNTest.KeyboardManager.__this.pressedButtons.contains(keyCode)) {
                    BNTest.KeyboardManager.__this.pressedButtons.add(keyCode);
                    BNTest.KeyboardManager.__this.tappedButtons.add(keyCode);
                }
                if ((keyCode >= 37 && keyCode <= 40) || keyCode === 32 || keyCode === 112) {
                    return false;
                }
                return true;
            },
            onKeyUp: function (evt) {
                var keyCode = evt.keyCode;

                if (BNTest.KeyboardManager.__this.pressedButtons.contains(keyCode)) {
                    BNTest.KeyboardManager.__this.pressedButtons.remove(keyCode);
                }
            },
            onMouseDown: function (evt) {
                var btn = evt.button;
                if (!BNTest.KeyboardManager.__this.pressedMouseButtons.contains(btn)) {
                    BNTest.KeyboardManager.__this.pressedMouseButtons.add(btn);
                    BNTest.KeyboardManager.__this.tappedMouseButtons.add(btn);
                }
                return btn < 1;
            },
            onMouseUp: function (evt) {
                var btn = evt.button;
                if (BNTest.KeyboardManager.__this.pressedMouseButtons.contains(btn)) {
                    BNTest.KeyboardManager.__this.pressedMouseButtons.remove(btn);
                }
                return btn < 1;
            },
            onMouseWheel: function (evt) {
                BNTest.KeyboardManager.get_this().mouseDelta += evt.detail;
                return true;
            },
            onMouseMove: function (evt) {
                BNTest.KeyboardManager.get_this().mousePosition = new BNTest.Vector2(evt.clientX, evt.clientY);

                //float left = float.Parse(App.Canvas.Style.Left.Replace("px", ""));
                var left = System.Single.parse(System.String.replaceAll(BNTest.App.div.style.left, "px", ""));
                var x = evt.clientX - left;
                var y = evt.clientY;

                //float scale = (App.Canvas.Width * 1.25f) / float.Parse(App.Canvas.Style.Width.Replace("px", ""));

                var scale = (BNTest.App.canvas.width) / System.Single.parse(System.String.replaceAll(BNTest.App.div.style.width, "px", ""));
                BNTest.KeyboardManager.get_this().cMouse = new BNTest.Vector2(x * scale, y * scale);
                //Console.WriteLine("mx:"+_this.CMouse.x + " my:" + _this.CMouse.y);
            }
        },
        pressedButtons: null,
        tappedButtons: null,
        pressedMouseButtons: null,
        tappedMouseButtons: null,
        mousePosition: null,
        cMouse: null,
        mouseDelta: 0,
        config: {
            init: function () {
                this.mousePosition = new BNTest.Vector2();
                this.cMouse = new BNTest.Vector2();
            }
        },
        ctor: function () {
            this.$initialize();
            this.pressedButtons = new (System.Collections.Generic.List$1(System.Int32))();
            this.tappedButtons = new (System.Collections.Generic.List$1(System.Int32))();
            this.pressedMouseButtons = new (System.Collections.Generic.List$1(System.Int32))();
            this.tappedMouseButtons = new (System.Collections.Generic.List$1(System.Int32))();

            var KD = BNTest.KeyboardManager.onKeyDown;
            document.onkeydown = KD;

            var KU = BNTest.KeyboardManager.onKeyUp;
            document.onkeyup = KU;

            var MM = BNTest.KeyboardManager.onMouseMove;
            document.onmousemove = MM;

            var MD = BNTest.KeyboardManager.onMouseDown;
            document.onmousedown = MD;

            var MU = BNTest.KeyboardManager.onMouseUp;
            document.onmouseup = MU;


            var MW = BNTest.KeyboardManager.onMouseWheel;
            document.onmousewheel = MW;
            document.onDomMouseScroll = MW;

            window.addEventListener("mousewheel", $_.BNTest.KeyboardManager.f1);
            window.addEventListener("DOMMouseScroll", $_.BNTest.KeyboardManager.f1);

            document.onmousewheel = $_.BNTest.KeyboardManager.f1;

            var NB = BNTest.KeyboardManager.neverinBounds;
            document.oncontextmenu = NB;
        }
    });

    Bridge.ns("BNTest.KeyboardManager", $_);

    Bridge.apply($_.BNTest.KeyboardManager, {
        f1: function (M) {
            BNTest.KeyboardManager.onMouseWheel(M);
        }
    });

    Bridge.define("BNTest.MathHelper", {
        statics: {
            PI: 3.14159274,
            PI2: 6.28318548,
            PIOver2: 1.57079637,
            distanceBetweenPoints: function (A, B) {
                return BNTest.MathHelper.distanceBetweenPoints$1(A.x, A.y, B.x, B.y);
            },
            distanceBetweenPoints$1: function (x1, y1, x2, y2) {
                return Math.sqrt((Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
            },
            clamp$1: function (value, min, max) {
                return Math.min(max, Math.max(min, value));
            },
            clamp: function (value, min, max) {
                if (min === void 0) { min = 0.0; }
                if (max === void 0) { max = 1.0; }
                return Math.min(max, Math.max(min, value));
            },
            lerp$1: function (value1, value2, amount) {
                return value1 + ((value2 - value1) * amount);
            },
            lerp: function (D1, D2, lerp) {
                lerp = BNTest.MathHelper.clamp(lerp);
                return (D1 * (1 - lerp)) + (D2 * lerp);
            },
            degreesToRadians: function (degrees) {
                return degrees * 0.0174532924;
            },
            radiansToDegrees: function (radians) {
                return radians * 57.29578;
            },
            getAngle: function (a, b) {
                var angle = (Math.atan2(b.y - a.y, b.x - a.x));
                return angle;
            },
            roughDistanceBetweenPoints: function (a, b) {
                //return (float)(Math.Abs(a.x - b.x) + Math.Abs(a.y - b.y));
                return (BNTest.Vector2.op_Subtraction(a, b)).getRoughLength();
            },
            magnitudeOfRectangle: function (R) {
                return R.width + R.height;
            },
            wrapRadians: function (radian) {
                while (radian < -3.14159274) {
                    radian += BNTest.MathHelper.PI2;
                }
                while (radian >= BNTest.MathHelper.PI) {
                    radian -= BNTest.MathHelper.PI2;
                }
                return radian;
                //return radian % PI2;
            },
            radianToVector: function (radian) {
                return new BNTest.Vector2(Math.cos(radian), Math.sin(radian));
            },
            within: function (val, min, max) {
                return val >= min && val <= max;
            },
            mean: function (val) {
                if (val === void 0) { val = []; }
                var ret = 0;
                var i = 0;
                while (i < val.length) {
                    ret += val[i];
                    i = (i + 1) | 0;
                }
                ret /= val.length;
                return ret;
            }
        }
    });

    Bridge.define("BNTest.Mesh", {
        statics: {
            texture: true,
            allowInterpolation: true,
            config: {
                properties: {
                    vertexPositionAttribute: 0,
                    vertexColorAttribute: 0,
                    vertexTextureCoord: 0
                }
            },
            init: function (vertexPositionAttribute, vertexColorAttribute, vertexTextureCoord) {
                BNTest.Mesh.setvertexPositionAttribute(vertexPositionAttribute);
                BNTest.Mesh.setvertexColorAttribute(vertexColorAttribute);

                BNTest.Mesh.setvertexTextureCoord(vertexTextureCoord);

                console.log("position:"+vertexPositionAttribute);
                console.log("color:" + vertexColorAttribute);
            },
            pushColor: function (array, C) {
                BNTest.Mesh.pushValue(array, [C.r, C.g, C.b, C.a]);
            },
            pushValue: function (array, values) {
                if (values === void 0) { values = []; }
                var i = 0;
                var v = 0;
                while (i < values.length) {
                    v = values[i];
                    array.push(v);
                    i = (i + 1) | 0;
                }
            }
        },
        cubeVerticesBuffer: null,
        cubeVerticesColorBuffer: null,
        cubeVerticesIndexBuffer: null,
        cubeVerticesTextureCoordBuffer: null,
        verticies: null,
        colors: null,
        indices: null,
        textureCoords: null,
        needsUpdate: true,
        hasBuffer: false,
        offset: null,
        rotation: null,
        scale: null,
        min: null,
        max: null,
        transformation: null,
        transformed: false,
        QV3: 0,
        qV3Set: false,
        config: {
            properties: {
                gl: null,
                GD: null
            },
            init: function () {
                this.verticies = [];
                this.colors = [];
                this.indices = [];
                this.textureCoords = [];
                this.offset = new BNTest.GLVec3.ctor();
                this.rotation = new BNTest.GLVec3.ctor();
                this.scale = new BNTest.GLVec3.ctor(1, 1, 1);
                this.min = new BNTest.GLVec3.ctor(System.Double.max, System.Double.max, System.Double.max);
                this.max = new BNTest.GLVec3.ctor(System.Double.min, System.Double.min, System.Double.min);
            }
        },
        ctor: function (GD) {
            this.$initialize();

            this.setgl(GD.gl);
            this.setGD(GD);
            this.transformation = new BNTest.WGMatrix();
        },
        getSize: function () {
            return BNTest.GLVec3.op_Subtraction(this.max, this.min);
        },
        /**
         * Apply Transformation permanently and then discard the transformation data.
         *
         * @instance
         * @public
         * @this BNTest.Mesh
         * @memberof BNTest.Mesh
         * @return  {void}
         */
        flattenGeometry: function () {
            this.updateTranformation();
            this.morphGeometry(this.transformation);
            this.resetTransformation();
        },
        resetTransformation: function () {
            this.transformation.clear();
            this.offset = new BNTest.GLVec3.ctor();
            this.scale = BNTest.GLVec3.getOne();
            this.rotation = new BNTest.GLVec3.ctor();
        },
        /**
         * permanently transforms all Verticies with the matrix provided.
         *
         * @instance
         * @public
         * @this BNTest.Mesh
         * @memberof BNTest.Mesh
         * @param   {BNTest.WGMatrix}    M
         * @return  {void}
         */
        morphGeometry: function (M) {
            if (this.verticies.length > 0) {
                var V = this.verticies;
                this.needsUpdate = true;
                //List<GLVec3> L = new List<GLVec3>();
                var i = 0;
                while (i < V.length) {
                    //L.Add(GLVec3.Transform(new GLVec3(V[i++], V[i++], V[i++]), M));
                    this.transformVert(i, M);
                    i = (i + 3) | 0;
                }
                /* var i = 0;
                    var V = Verticies;
                    while (i < V.Length)
                    {
                        L.Add(GLVec3.Transform(new GLVec3(V[i++], V[i++], V[i++]),M));
                    }*/
            }
        },
        transformVert: function (index, M) {
            var i = index;
            var V = this.verticies;
            var T1 = new BNTest.GLVec3.ctor(V[Bridge.identity(i, (i = (i + 1) | 0))], V[Bridge.identity(i, (i = (i + 1) | 0))], V[Bridge.identity(i, (i = (i + 1) | 0))]);
            var T = BNTest.GLVec3.transform(T1, M, true);
            i = index;
            V[Bridge.identity(i, (i = (i + 1) | 0))] = T.x;
            V[Bridge.identity(i, (i = (i + 1) | 0))] = T.y;
            V[Bridge.identity(i, (i = (i + 1) | 0))] = T.z;
        },
        render: function () {
            if (this.indices.length <= 0) {
                return;
            }
            if (this.needsUpdate) {
                this.update();
            }
            if (this.cubeVerticesBuffer != null) {
                var G = this.getgl();

                // Draw the cube by binding the array buffer to the cube's vertices
                // array, setting attributes, and pushing it to GL.

                G.bindBuffer(G.ARRAY_BUFFER, this.cubeVerticesBuffer);
                G.vertexAttribPointer(BNTest.Mesh.getvertexPositionAttribute(), 3, G.FLOAT, false, 0, 0);

                // Set the colors attribute for the vertices.

                G.bindBuffer(G.ARRAY_BUFFER, this.cubeVerticesColorBuffer);
                G.vertexAttribPointer(BNTest.Mesh.getvertexColorAttribute(), 4, G.FLOAT, false, 0, 0);

                if (BNTest.Mesh.texture) {
                    G.bindBuffer(G.ARRAY_BUFFER, this.cubeVerticesTextureCoordBuffer);
                    G.vertexAttribPointer(BNTest.Mesh.getvertexTextureCoord(), 2, G.FLOAT, false, 0, 0);
                }

                // Draw the cube.

                G.bindBuffer(G.ELEMENT_ARRAY_BUFFER, this.cubeVerticesIndexBuffer);
                this.draw();
            }
        },
        replaceAllColors: function (NewColor) {
            var N = System.Array.init(0, 0);
            var i = 0;
            while (i < this.colors.length) {
                N.push(NewColor.r);
                N.push(NewColor.g);
                N.push(NewColor.b);
                N.push(NewColor.a);
                i = (i + 4) | 0;
            }
            this.colors = N;
            this.needsUpdate = true;
            //Helper.AddMultiple<double>(N, NewColor, Colors.Length);
        },
        combine: function (M, respectOffsets) {
            if (respectOffsets === void 0) { respectOffsets = false; }
            if (M.indices.length > 0) {
                /* M.Verticies = Verticies.ToArray();
                    M.Colors = Colors.ToArray();
                    M.Indices = Indices.ToArray();

                    M.TextureCoords = TextureCoords.ToArray();*/


                var offset = (Bridge.Int.div(this.verticies.length, 3)) | 0;
                var i = 0;
                if (!respectOffsets) {
                    this.updateMinMax$2(M.verticies);
                    BNTest.HelperExtensions.pushRange(System.Double, this.verticies, M.verticies);
                } else {
                    var P = BNTest.GLVec3.op_Subtraction(M.offset, this.offset);
                    i = 0;
                    while (i < M.verticies.length) {
                        var N = BNTest.GLVec3.op_Addition(new BNTest.GLVec3.ctor(M.verticies[Bridge.identity(i, (i = (i + 1) | 0))], M.verticies[Bridge.identity(i, (i = (i + 1) | 0))], M.verticies[Bridge.identity(i, (i = (i + 1) | 0))]), P);
                        this.updateMinMax(N);
                        this.verticies.push(N.x);
                        this.verticies.push(N.y);
                        this.verticies.push(N.z);
                        /* var V = M.Verticies[i++] + P.X;
                            Verticies.Push(V);
                            V = M.Verticies[i++] + P.Y;
                            Verticies.Push(V);
                            V = M.Verticies[i++] + P.Z;
                            Verticies.Push(V);*/

                    }
                }
                BNTest.HelperExtensions.pushRange(System.Double, this.colors, M.colors);
                BNTest.HelperExtensions.pushRange(System.Double, this.textureCoords, M.textureCoords);

                i = 0;
                while (i < M.indices.length) {
                    this.indices.push((((M.indices[i] + offset) | 0)));
                    i = (i + 1) | 0;
                }
                this.needsUpdate = true;
            }
        },
        updateTranformation: function () {
            this.transformed = !(this.scale.x === 1 && this.scale.y === 1 && this.scale.z === 1) || (this.rotation.getRoughLength() !== 0 || this.offset.getRoughLength() !== 0);

            if (this.transformed) {
                this.transformation.clear();
                //Transformation = new WGMatrix();
                var M = this.transformation;
                var scaled = !(this.scale.x === 1 && this.scale.y === 1 && this.scale.z === 1);
                var offseted = this.offset.getRoughLength() !== 0;
                if (scaled) {
                    if (offseted) {
                        //M.mvTranslate(new double[] { Offset.X, Offset.Y, Offset.Z });
                        M.setPositionThenScale(this.offset, this.scale);
                    } else {
                        M.mvScale(this.scale);
                    }
                    //M.SetScale(Scale);
                }

                /* if (Offset.RoughLength != 0)
                    {
                        M.mvTranslate(new double[] { Offset.X, Offset.Y, Offset.Z });
                    }
                    if (!(Scale.X == 1 && Scale.Y == 1 && Scale.Z == 1))
                    {
                        M.mvScale(Scale);
                    }*/
                if (this.rotation.getRoughLength() !== 0) {
                    /* M.mvRotate(Rotation.Y, new double[] { 0,-1,0});
                        M.mvRotate(Rotation.X, new double[] { -1, 0, 0 });
                        M.mvRotate(Rotation.Z, new double[] { 0, 0, -1 });*/
                    /* if (Rotation.Y != 0)
                            M.mvRotate(Rotation.Y, new double[] { 0, -1, 0 });
                        if (Rotation.X != 0)
                            M.mvRotate(Rotation.X, new double[] { -1, 0, 0 });
                        if (Rotation.Z != 0)
                            M.mvRotate(Rotation.Z, new double[] { 0, 0, -1 });*/
                    if (this.rotation.y !== 0) {
                        M.rotateY(this.rotation.y * 0.01745329251);
                    }
                    if (this.rotation.x !== 0) {
                        M.rotateX(this.rotation.x * 0.01745329251);
                    }
                    if (this.rotation.z !== 0) {
                        M.rotateZ(this.rotation.z * 0.01745329251);
                    }
                }
                if (!scaled && offseted) {
                    M.setTranslation(this.offset);
                }

                //Apply matrix transformation and immediately send it to the shader.
                //GD.multMatrix(M.mvMatrix, true);
            }
        },
        draw: function () {
            this.transformed = !(this.scale.x === 1 && this.scale.y === 1 && this.scale.z === 1) || (this.rotation.getRoughLength() !== 0 || this.offset.getRoughLength() !== 0);

            if (this.transformed) {
                this.updateTranformation();
                this.getGD().mvPushMatrix();
                //GD.matrix.mvPushMatrix();
                this.getGD().multMatrix(this.transformation.mvMatrix, true);
            }
            var G = this.getgl();
            this.getGD().flushMatrix();
            G.drawElements(G.TRIANGLES, this.indices.length, G.UNSIGNED_SHORT, 0);
            if (this.transformed) {
                //GD.matrix.mvPopMatrix();
                this.getGD().mvPopMatrix();
            }
            return;

            var l = this.indices.length;
            var i = 0;
            var sz = 6;
            while (i < l) {
                G.drawElements(G.TRIANGLES, sz, G.UNSIGNED_SHORT, i);
                i = (i + sz) | 0;
            }
        },
        update: function () {
            if (!this.needsUpdate) {
                return;
            }
            if (this.hasBuffer) {
                this.clearBuffers();
            }

            var G = this.getgl();

            this.cubeVerticesBuffer = G.createBuffer();
            G.bindBuffer(G.ARRAY_BUFFER, this.cubeVerticesBuffer);
            G.bufferData(G.ARRAY_BUFFER, new Float32Array(this.verticies), G.STATIC_DRAW);

            var colors = this.colors;
            //var generatedColors = Script.Write<double[][]>("[]");

            var generatedColors = colors;
            this.cubeVerticesColorBuffer = G.createBuffer();
            G.bindBuffer(G.ARRAY_BUFFER, this.cubeVerticesColorBuffer);
            G.bufferData(G.ARRAY_BUFFER, new Float32Array(generatedColors), G.STATIC_DRAW);

            this.cubeVerticesIndexBuffer = G.createBuffer();
            G.bindBuffer(G.ELEMENT_ARRAY_BUFFER, this.cubeVerticesIndexBuffer);
            G.bufferData(G.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), G.STATIC_DRAW);

            //if (texture)
            {
                this.cubeVerticesTextureCoordBuffer = G.createBuffer();
                G.bindBuffer(G.ARRAY_BUFFER, this.cubeVerticesTextureCoordBuffer);
                G.bufferData(G.ARRAY_BUFFER, new Float32Array(this.textureCoords), G.STATIC_DRAW);
            }

            this.needsUpdate = false;
        },
        getVerticies: function () {
            var ret = System.Array.init(0, null);
            var i = 0;
            while (i < this.verticies.length) {
                var X = this.verticies[i];
                i = (i + 1) | 0;
                var Y = this.verticies[i];
                i = (i + 1) | 0;
                var Z = this.verticies[i];
                i = (i + 1) | 0;
                ret.push(new BNTest.GLVec3.ctor(X, Y, Z));
            }
            return ret;
        },
        setVerticies: function (V) {
            this.verticies = System.Array.init(0, 0);
            var i = 0;
            while (i < V.length) {
                this.verticies.push(V[i].x);
                this.verticies.push(V[i].y);
                this.verticies.push(V[i].z);
                i = (i + 1) | 0;
            }
        },
        smoothen: function (strength) {
            if (strength === void 0) { strength = 0.35; }
            var range = 3.0;
            var list = System.Array.init(0, null);
            var i = 0;
            var L = this.getVerticies();
            while (i < L.length) {
                var V = L[i];
                //var R = L.Where(NV => !NV.Equals(V) && (NV - V).Length < range).ToArray();
                var k = 0;
                var R = System.Array.init(0, null);
                while (k < L.length) {
                    var NV = L[k];
                    if (!NV.equals(V) && (BNTest.GLVec3.op_Subtraction(NV, V)).getRoughLength() < range) {
                        R.push(NV);
                    }
                    k = (k + 1) | 0;
                }
                //var R = L.Where(NV => !NV.Equals(V) && (NV - V).RoughLength < range).ToArray();
                R.push(V);
                list.push(BNTest.GLVec3.lerp(V, BNTest.GLVec3.mean(R), strength));
                i = (i + 1) | 0;
            }
            this.setVerticies(list);
        },
        applyPalette: function (palette) {
            var Keys = System.Linq.Enumerable.from(palette.getKeys()).toList(BNTest.GLColor);
            var Vals = System.Linq.Enumerable.from(palette.getValues()).toList(BNTest.GLColor);
            if (Keys.getCount() <= 0) {
                return;
            }
            var kln = Keys.getCount();
            var key;
            var i = 0;
            var ln = this.colors.length;
            var LC = null;
            var VC = null;
            while (i < ln) {
                var C = new BNTest.GLColor(this.colors[i], this.colors[((i + 1) | 0)], this.colors[((i + 2) | 0)], this.colors[((i + 3) | 0)]);
                key = null;
                if (LC != null && C.equals(LC)) {
                    if (VC != null) {
                        this.colors[i] = VC.r;
                        this.colors[((i + 1) | 0)] = VC.g;
                        this.colors[((i + 2) | 0)] = VC.b;
                        this.colors[((i + 3) | 0)] = VC.a;
                    }
                    i = (i + 4) | 0;
                    continue;
                }
                if (C != null && C.a > 0) {
                    var k = 0;
                    while (k < kln) {
                        var t = Keys.getItem(k);
                        if (t.similar(C)) {
                            key = t;
                            k = ln;
                        }
                        k = (k + 1) | 0;
                    }
                    if (key != null) {
                        var ind = Keys.indexOf(key);
                        if (ind >= 0) {
                            //Map[X, Y, Z] = Vals[ind];
                            VC = Vals.getItem(ind);
                            this.colors[i] = VC.r;
                            this.colors[((i + 1) | 0)] = VC.g;
                            this.colors[((i + 2) | 0)] = VC.b;
                            this.colors[((i + 3) | 0)] = VC.a;
                        } else {
                            VC = null;
                        }
                    } else {
                        VC = null;
                    }
                }
                i = (i + 4) | 0;
                LC = C;
            }

            /* int X = 0;
                int Y = 0;
                int Z = 0;
                var MX = Map.GetLength(0);
                var MY = Map.GetLength(1);
                var MZ = Map.GetLength(2);
                GLColor key = null;
                int i = 0;
                int ln = Keys.Count;
                while (X < MX)
                {
                    while (Y < MY)
                    {
                        while (Z < MZ)
                        {
                            var C = Map[X, Y, Z];
                            if (C != null && C.A > 0)
                            {

                                //var ind = Keys.IndexOf(C);
                                ///Keys.ForEach(K => { if (K.Similar(C)){ key = K; } });
                                key = null;
                                i = 0;
                                while (i < ln)
                                {
                                    var t = Keys[i];
                                    if (t.Similar(C))
                                    {
                                        key = t;
                                        i = ln;
                                    }
                                    i++;
                                }
                                //GLColor key = (Keys.First(C2 => C2.Equals(C) ));

                                if (key != null)
                                {
                                    int ind = Keys.IndexOf(key);
                                    if (ind >= 0)
                                    {
                                        Map[X, Y, Z] = Vals[ind];
                                    }
                                }
                            }
                            Z++;
                        }
                        Z = 0;
                        Y++;
                    }
                    Y = 0;
                    Z = 0;
                    X++;
                }*/
        },
        /**
         * 
         *
         * @instance
         * @public
         * @this BNTest.Mesh
         * @memberof BNTest.Mesh
         * @param   {boolean}        shallow    If true, all variables will be linked directly instead of making new copies.
         * @return  {BNTest.Mesh}
         */
        clone: function (shallow) {
            if (shallow === void 0) { shallow = false; }
            var M = new BNTest.Mesh(this.getGD());

            if (!shallow) {
                var i = 0;
                M.verticies = System.Array.init(0, 0);
                BNTest.HelperExtensions.pushRange(System.Double, M.verticies, this.verticies);
                //M.Verticies = Verticies.ToArray();
                M.colors = System.Array.init(0, 0);
                BNTest.HelperExtensions.pushRange(System.Double, M.colors, this.colors);
                //M.Colors = Colors.ToArray();
                M.indices = System.Array.init(0, 0);
                BNTest.HelperExtensions.pushRange(System.Int32, M.indices, this.indices);
                //M.Indices = Indices.ToArray();

                //M.TextureCoords = TextureCoords.ToArray();
                M.textureCoords = System.Array.init(0, 0);
                BNTest.HelperExtensions.pushRange(System.Double, M.textureCoords, this.textureCoords);
                M.needsUpdate = true;

                M.min = this.min.clone();
                M.max = this.max.clone();

                M.offset = this.offset.clone();
                M.rotation = this.rotation.clone();
                M.scale = this.scale.clone();
            } else {
                M.verticies = this.verticies;
                M.colors = this.colors;
                M.indices = this.indices;

                M.textureCoords = this.textureCoords;

                M.needsUpdate = this.needsUpdate;
                //if (!needsUpdate)
                {
                    M.cubeVerticesBuffer = this.cubeVerticesBuffer;
                    M.cubeVerticesColorBuffer = this.cubeVerticesColorBuffer;
                    M.cubeVerticesIndexBuffer = this.cubeVerticesIndexBuffer;
                    M.cubeVerticesTextureCoordBuffer = this.cubeVerticesTextureCoordBuffer;
                }

                M.min = this.min;
                M.max = this.max;

                M.offset = this.offset;
                M.rotation = this.rotation;
                M.scale = this.scale;
            }



            return M;
        },
        unloadBuffers: function () {
            if (!this.hasBuffer) {
                return;
            }
            this.clearBuffers();
            this.needsUpdate = true;
        },
        clearBuffers: function () {
            if (!this.hasBuffer) {
                return;
            }
            this.getgl().deleteBuffer(this.cubeVerticesBuffer);
            this.getgl().deleteBuffer(this.cubeVerticesColorBuffer);
            this.getgl().deleteBuffer(this.cubeVerticesIndexBuffer);
            //if (texture)
            {
                this.getgl().deleteBuffer(this.cubeVerticesTextureCoordBuffer);
            }
            this.hasBuffer = false;
        },
        addTextureRect: function (times) {
            if (times === void 0) { times = 1; }
            while (times > 0) {
                times = (times - 1) | 0;
                this.textureCoords.push(0, 0, 0, 1, 1, 0, 1, 1);
            }
        },
        addVoxelMap: function (VM, interpolate, center, toplayeronly) {
            if (interpolate === void 0) { interpolate = false; }
            if (center === void 0) { center = true; }
            if (toplayeronly === void 0) { toplayeronly = false; }
            if (interpolate && !BNTest.Mesh.allowInterpolation) {
                interpolate = false;
            }
            var Map = VM.map;
            var X = 0;
            var Y = 0;
            var Z = 0;
            var SV = new BNTest.GLVec3.ctor(0, 0, 0);
            if (center) {
                SV = BNTest.GLVec3.op_Addition(SV, new BNTest.GLVec3.ctor(((-System.Array.getLength(Map, 0)) | 0) / 2.0, ((-System.Array.getLength(Map, 1)) | 0) / 2.0, ((-System.Array.getLength(Map, 2)) | 0) / 2.0));
            }
            var V = BNTest.GLVec3.op_Addition(SV, new BNTest.GLVec3.ctor());
            var VB = new BNTest.GLVec3.ctor(1, 1, 1);
            var MX = System.Array.getLength(Map, 0);
            var MY = System.Array.getLength(Map, 1);
            var MZ = System.Array.getLength(Map, 2);
            this.qV3Set = true;
            this.QV3 = (Bridge.Int.div(this.verticies.length, 3)) | 0;
            while (X < MX) {
                while (Y < MY) {
                    while (Z < MZ) {
                        /* V.X = X;
                            V.Y = Y;
                            V.Z = Z;*/
                        //GLColor C = VM.GetVoxel(X, Y, Z);
                        var C = Map.get([X, Y, Z]);
                        if (VM.valid(C)) {
                            if (!toplayeronly) {
                                var interpolation = null;
                                if (interpolate) {
                                    interpolation = VM.getValidQuadrants(X, Y, Z);
                                }
                                var sides = VM.getInvisibleSides(X, Y, Z);
                                this.addCube2(V, BNTest.GLVec3.op_Addition(V, VB), C, sides, interpolation);
                            } else {
                                this.addRectangle(V, BNTest.GLVec3.op_Addition(V, new BNTest.GLVec3.ctor(1, 0, 1)), C);
                            }
                        }
                        V.z += 1;
                        Z = (Z + 1) | 0;
                    }
                    V.z = SV.z;
                    V.y += 1;
                    Z = 0;
                    Y = (Y + 1) | 0;
                }
                V.z = SV.z;
                V.y = SV.y;
                V.x += 1;
                Y = 0;
                Z = 0;
                X = (X + 1) | 0;
            }
            this.qV3Set = false;
        },
        addVert: function (V, C) {
            BNTest.Mesh.pushValue(this.verticies, [V.x, V.y, V.z]);
            BNTest.Mesh.pushColor(this.colors, C);
            BNTest.Mesh.pushValue(this.indices, [((Bridge.Int.div(this.indices.length, 3)) | 0)]);
            this.needsUpdate = true;
        },
        addCube1: function (Min, Max, C) {
            var GV = System.Array.init(8, null);
            GV[0] = new BNTest.GLVec3.ctor(Min.x, Min.y, Min.z);
            GV[1] = new BNTest.GLVec3.ctor(Max.x, Min.y, Min.z);
            GV[2] = new BNTest.GLVec3.ctor(Min.x, Max.y, Min.z);
            GV[3] = new BNTest.GLVec3.ctor(Max.x, Max.y, Min.z);


            GV[4] = new BNTest.GLVec3.ctor(Min.x, Min.y, Max.z);
            GV[5] = new BNTest.GLVec3.ctor(Max.x, Min.y, Max.z);
            GV[6] = new BNTest.GLVec3.ctor(Min.x, Max.y, Max.z);
            GV[7] = new BNTest.GLVec3.ctor(Max.x, Max.y, Max.z);
            C = BNTest.GLColor.random();
            //top
            this.addRectangle$1(GV[0], GV[1], GV[2], GV[3], C);
            C = BNTest.GLColor.random();
            //bottom
            this.addRectangle$1(GV[4], GV[5], GV[6], GV[7], C);
            C = BNTest.GLColor.random();
            //left
            this.addRectangle$1(GV[0], GV[2], GV[4], GV[6], C);
            C = BNTest.GLColor.random();
            //bottom
            this.addRectangle$1(GV[1], GV[3], GV[5], GV[7], C);
            C = BNTest.GLColor.random();
            //
            this.addRectangle$1(GV[0], GV[1], GV[4], GV[5], C);
            C = BNTest.GLColor.random();
            //
            this.addRectangle$1(GV[2], GV[3], GV[6], GV[7], C);
        },
        addCube2: function (Min, Max, C, invisible, interpolation) {
            if (interpolation === void 0) { interpolation = null; }
            if (invisible == null) {
                invisible = System.Array.init(6, false);
            }
            var GV = System.Array.init(8, null);
            GV[0] = new BNTest.GLVec3.ctor(Min.x, Min.y, Min.z);
            GV[1] = new BNTest.GLVec3.ctor(Max.x, Min.y, Min.z);
            GV[2] = new BNTest.GLVec3.ctor(Min.x, Max.y, Min.z);
            GV[3] = new BNTest.GLVec3.ctor(Max.x, Max.y, Min.z);


            GV[4] = new BNTest.GLVec3.ctor(Min.x, Min.y, Max.z);
            GV[5] = new BNTest.GLVec3.ctor(Max.x, Min.y, Max.z);
            GV[6] = new BNTest.GLVec3.ctor(Min.x, Max.y, Max.z);
            GV[7] = new BNTest.GLVec3.ctor(Max.x, Max.y, Max.z);

            if (interpolation != null) {
                //if true, ends are round shaped, if false tips are pointy.
                var quarter = true;
                //GLVec3 center = Min + ((Max - Min) * 0.5);
                var center = BNTest.GLVec3.getCenter(Min, Max);
                var i = 0;
                var GVL = GV.length;
                while (i < GVL) {
                    if (!interpolation[i]) {
                        if (quarter) {
                            GV[i] = BNTest.GLVec3.getCenter(GV[i], center);
                        } else {
                            GV[i] = center;
                        }
                    }
                    i = (i + 1) | 0;
                }
            }
            if (!this.qV3Set) {
                this.QV3 = (Bridge.Int.div(this.verticies.length, 3)) | 0;
            }

            //top
            if (!invisible[0]) {
                this.quickAddRectangle(GV[0], GV[1], GV[2], GV[3], C);
            }
            //bottom
            if (!invisible[1]) {
                this.quickAddRectangle(GV[4], GV[5], GV[6], GV[7], C);
            }

            //left
            if (!invisible[2]) {
                this.quickAddRectangle(GV[0], GV[2], GV[4], GV[6], C);
            }
            //bottom
            if (!invisible[3]) {
                this.quickAddRectangle(GV[1], GV[3], GV[5], GV[7], C);
            }

            //
            if (!invisible[4]) {
                this.quickAddRectangle(GV[0], GV[1], GV[4], GV[5], C);
            }
            //
            if (!invisible[5]) {
                this.quickAddRectangle(GV[2], GV[3], GV[6], GV[7], C);
            }
        },
        addCube: function (Min, Max, C) {
            this.addCube1(Min, Max, C);
            return;
            var dimension = 1;
            while (dimension < 3) {
                //dimension = 0;
                C = BNTest.GLColor.random();
                this.addRectangle(Min, Max.syncCopy(Min, dimension), C);
                C = BNTest.GLColor.random();
                this.addRectangle(Min.syncCopy(Max, dimension), Max, C);
                dimension = (dimension + 1) | 0;
            }
        },
        addRectangle: function (Min, Max, C) {
            var V1 = Min;
            var V2 = new BNTest.GLVec3.ctor(Max.x, Min.y, Min.z);
            var V3 = new BNTest.GLVec3.ctor(Min.x, Max.y, Max.z);
            var V4 = Max;
            this.addRectangle$1(V1, V2, V3, V4, C);
        },
        addRectangle$1: function (V1, V2, V3, V4, C) {
            var ind = (Bridge.Int.div(this.verticies.length, 3)) | 0;
            var V;

            V = V1;
            BNTest.Mesh.pushValue(this.verticies, [V.x, V.y, V.z]);
            BNTest.Mesh.pushColor(this.colors, C);
            V = V2;
            BNTest.Mesh.pushValue(this.verticies, [V.x, V.y, V.z]);
            BNTest.Mesh.pushColor(this.colors, C);
            V = V3;
            BNTest.Mesh.pushValue(this.verticies, [V.x, V.y, V.z]);
            BNTest.Mesh.pushColor(this.colors, C);
            V = V4;
            BNTest.Mesh.pushValue(this.verticies, [V.x, V.y, V.z]);
            BNTest.Mesh.pushColor(this.colors, C);

            this.updateMinMax$1([V1, V2, V3, V4]);



            BNTest.Mesh.pushValue(this.indices, [ind, ((ind + 1) | 0), ((ind + 2) | 0), ((ind + 3) | 0), ((ind + 1) | 0), ((ind + 2) | 0)]);

            //if (texture)
            {

                BNTest.Mesh.pushValue(this.textureCoords, [0, 0, 1, 0, 0, 1, 1, 1]);
            }
            this.needsUpdate = true;
        },
        updateMinMax$1: function (V) {
            if (V === void 0) { V = []; }
            var i = 0;
            while (i < V.length) {
                this.updateMinMax(V[i]);
                i = (i + 1) | 0;
            }
        },
        updateMinMax$2: function (V) {
            if (V === void 0) { V = []; }
            var i = 0;
            while (i < V.length) {
                var N = new BNTest.GLVec3.ctor(V[i], V[((i + 1) | 0)], V[((i + 2) | 0)]);
                this.updateMinMax(N);
                i = (i + 3) | 0;
            }
        },
        updateMinMax: function (V) {
            this.min = BNTest.GLVec3.min(this.min, V);
            this.max = BNTest.GLVec3.max(this.max, V);
        },
        quickAddRectangle: function (V1, V2, V3, V4, C) {
            //int ind = Verticies.Length / 3;
            var ind = this.QV3;
            var V;

            V = V1;
            BNTest.Mesh.pushValue(this.verticies, [V.x, V.y, V.z]);
            BNTest.Mesh.pushColor(this.colors, C);
            V = V2;
            BNTest.Mesh.pushValue(this.verticies, [V.x, V.y, V.z]);
            BNTest.Mesh.pushColor(this.colors, C);
            V = V3;
            BNTest.Mesh.pushValue(this.verticies, [V.x, V.y, V.z]);
            BNTest.Mesh.pushColor(this.colors, C);
            V = V4;
            BNTest.Mesh.pushValue(this.verticies, [V.x, V.y, V.z]);
            BNTest.Mesh.pushColor(this.colors, C);

            this.updateMinMax$1([V1, V2, V3, V4]);



            BNTest.Mesh.pushValue(this.indices, [ind, ((ind + 1) | 0), ((ind + 2) | 0), ((ind + 3) | 0), ((ind + 1) | 0), ((ind + 2) | 0)]);

            //if (texture)
            {

                BNTest.Mesh.pushValue(this.textureCoords, [0, 0, 1, 0, 0, 1, 1, 1]);
            }
            this.QV3 = (this.QV3 + 4) | 0;
            this.needsUpdate = true;
        }
    });

    Bridge.define("BNTest.Model", {
        meshes: null,
        children: null,
        offset: null,
        rotation: null,
        scale: null,
        transformation: null,
        transformed: false,
        inView: true,
        /**
         * makes the model render even if InView is false(this does not override the Visible property).
         *
         * @instance
         * @public
         * @memberof BNTest.Model
         * @default false
         * @type boolean
         */
        forceRender: false,
        customBoundingBox: null,
        alpha: 1,
        color: null,
        bleedThrough: false,
        znearRate: -1,
        config: {
            properties: {
                gl: null,
                GD: null,
                Visible: true
            },
            init: function () {
                this.offset = new BNTest.GLVec3.ctor();
                this.rotation = new BNTest.GLVec3.ctor();
                this.scale = new BNTest.GLVec3.ctor(1, 1, 1);
                this.color = new BNTest.GLColor(1, 1, 1);
            }
        },
        ctor: function (GD) {
            this.$initialize();
            this.setGD(GD);
            this.setgl(GD.gl);
            this.meshes = new (System.Collections.Generic.List$1(BNTest.Mesh))();
            this.children = new (System.Collections.Generic.List$1(BNTest.Model))();
            this.transformation = new BNTest.WGMatrix();
        },
        getBoundingBox: function () {
            if (this.customBoundingBox != null) {
                return BNTest.BoundingBox.op_Addition(this.customBoundingBox, this.offset);
            }
            var O = this.offset;
            this.offset = new BNTest.GLVec3.ctor();
            this.updateTransform();
            this.offset = O;
            var Min = new BNTest.GLVec3.ctor(System.Double.max, System.Double.max, System.Double.max);
            var Max = new BNTest.GLVec3.ctor(System.Double.min, System.Double.min, System.Double.min);

            var T = this.transformation;
            var i = 0;
            var ln = this.meshes.getCount();
            while (i < ln) {
                var Mmn = BNTest.GLVec3.transform(this.meshes.getItem(i).min, T);
                var Mmx = BNTest.GLVec3.transform(this.meshes.getItem(i).max, T);
                var tmp = new BNTest.BoundingBox.$ctor1(this.meshes.getItem(i).min, this.meshes.getItem(i).max);
                //Helper.Log("mesh=>" + tmp.ToString());
                Min = BNTest.GLVec3.min(Min, Mmn);
                Max = BNTest.GLVec3.max(Max, Mmx);
                i = (i + 1) | 0;
            }
            i = 0;
            ln = this.children.getCount();
            while (i < ln) {
                var B = this.children.getItem(i).getBoundingBox();
                Min = BNTest.GLVec3.min(Min, B.min);
                Max = BNTest.GLVec3.max(Max, B.max);
                i = (i + 1) | 0;
            }
            var ret = new BNTest.BoundingBox.$ctor1(BNTest.GLVec3.op_Addition(Min, this.offset), BNTest.GLVec3.op_Addition(Max, this.offset));
            //Helper.Log("Final=>" + ret.ToString());
            return ret;
        },
        clear: function () {
            this.unloadBuffers();

            this.meshes = new (System.Collections.Generic.List$1(BNTest.Mesh))();
            this.children = new (System.Collections.Generic.List$1(BNTest.Model))();

            //Offset = new GLVec3();
            this.rotation = new BNTest.GLVec3.ctor();
            this.scale = new BNTest.GLVec3.ctor(1, 1, 1);
        },
        unloadBuffers: function () {
            BNTest.HelperExtensions.forEach(BNTest.Mesh, this.meshes, $_.BNTest.Model.f1);
            BNTest.HelperExtensions.forEach(BNTest.Model, this.children, $_.BNTest.Model.f2);
        },
        updateTransform: function () {
            //Transformation = new WGMatrix();
            this.transformed = !(this.scale.x === 1 && this.scale.y === 1 && this.scale.z === 1) || (this.rotation.getRoughLength() !== 0 || this.offset.getRoughLength() !== 0);

            if (this.transformed) {
                this.transformation.clear();

                var M = this.transformation;
                var scaled = !(this.scale.x === 1 && this.scale.y === 1 && this.scale.z === 1);
                var offseted = this.offset.getRoughLength() !== 0;


                if (scaled) {
                    if (offseted) {
                        //M.mvTranslate(new double[] { Offset.X, Offset.Y, Offset.Z });
                        M.setPositionThenScale(this.offset, this.scale);
                    } else {
                        M.mvScale(this.scale);
                    }
                    //M.SetScale(Scale);
                }
                /* if (Offset.RoughLength != 0)
                    {
                        M.mvTranslate(new double[] { Offset.X, Offset.Y, Offset.Z });
                    }
                    if (!(Scale.X == 1 && Scale.Y == 1 && Scale.Z == 1))
                    {
                        M.mvScale(Scale);
                    }*/
                if (this.rotation.getRoughLength() !== 0) {
                    /* M.mvRotate(Rotation.Y, new double[] { 0, -1, 0 });
                        M.mvRotate(Rotation.X, new double[] { -1, 0, 0 });
                        M.mvRotate(Rotation.Z, new double[] { 0, 0, -1 });*/
                    /* if (Rotation.Y != 0)
                            M.mvRotate(Rotation.Y, new double[] { 0, -1, 0 });
                        if (Rotation.X != 0)
                            M.mvRotate(Rotation.X, new double[] { -1, 0, 0 });
                        if (Rotation.Z != 0)
                            M.mvRotate(Rotation.Z, new double[] { 0, 0, -1 });*/
                    if (this.rotation.y !== 0) {
                        M.rotateY(this.rotation.y * 0.01745329251);
                    }
                    if (this.rotation.x !== 0) {
                        M.rotateX(this.rotation.x * 0.01745329251);
                    }
                    if (this.rotation.z !== 0) {
                        M.rotateZ(this.rotation.z * 0.01745329251);
                    }
                }
                if (!scaled && offseted) {
                    M.setTranslation(this.offset);
                }


                //Apply matrix transformation and immediately send it to the shader.
            }
        },
        clone: function () {
            var ret = new BNTest.Model(this.getGD());
            ret.copyFrom(this);
            return ret;
        },
        copyFrom: function (source, shallow) {
            if (shallow === void 0) { shallow = false; }
            var M = source;
            if (!shallow) {
                BNTest.HelperExtensions.forEach(BNTest.Mesh, M.meshes, Bridge.fn.bind(this, $_.BNTest.Model.f3));
                BNTest.HelperExtensions.forEach(BNTest.Model, M.children, Bridge.fn.bind(this, $_.BNTest.Model.f4));
            } else {
                this.meshes = M.meshes;
                this.children = M.children;
            }
            this.bleedThrough = M.bleedThrough;
            this.color = M.color;
            this.alpha = M.alpha;
            this.scale = M.scale;
        },
        smoothen: function () {
            var i = 0;
            while (i < this.meshes.getCount()) {
                this.meshes.getItem(i).smoothen();
                i = (i + 1) | 0;
            }
            i = 0;
            while (i < this.children.getCount()) {
                this.children.getItem(i).smoothen();
                i = (i + 1) | 0;
            }
        },
        render: function () {
            this.updateTransform();
            if (!this.getVisible() || (!this.inView && !this.forceRender)) {
                return;
            }
            if (this.transformed) {
                this.getGD().mvPushMatrix();
                //GD.matrix.mvPushMatrix();
                this.getGD().multMatrix(this.transformation.mvMatrix, true);
            }
            if (this.alpha < 1) {
                this.getGD().pushAlpha(this.alpha);
            }
            var col = !this.color.equals(BNTest.GLColor.white);
            if (col) {
                this.getGD().setColor(this.color);
            }
            if (this.bleedThrough) {
                //GD.SetDepthFunc(Depthfunc);
                this.getGD().setDepthTest(false);
            }
            if (this.znearRate > 0) {
                this.getGD().setPerspective(this.znearRate);
            }
            /* meshes.ForEach("render");
                children.ForEach("render");*/
            /* meshes.ForEach(M => M.Render());
                children.ForEach(M => M.Render());*/
            var i = 0;
            var ln = this.meshes.getCount();
            while (i < ln) {
                this.meshes.getItem(i).render();
                i = (i + 1) | 0;
            }
            ln = this.children.getCount();
            while (i < ln) {
                this.children.getItem(i).render();
                i = (i + 1) | 0;
            }
            if (this.znearRate > 0) {
                this.getGD().setPerspective();
            }
            /* foreach (var item in meshes)
                    {
                        item.Render();
                    }
                    foreach (var item in children)
                    {
                        item.Render();
                    }*/
            if (this.bleedThrough) {
                this.getGD().setDepthTest(true);
                //GD.SetDepthFunc(GD.gl.LEQUAL);
            }
            if (col) {
                this.getGD().resetColor();
            }
            if (this.alpha < 1) {
                this.getGD().popAlpha();
            }
            if (this.transformed) {
                //GD.matrix.mvPopMatrix();
                this.getGD().mvPopMatrix();
            }
        }
    });

    Bridge.ns("BNTest.Model", $_);

    Bridge.apply($_.BNTest.Model, {
        f1: function (M) {
            M.unloadBuffers();
        },
        f2: function (C) {
            C.unloadBuffers();
        },
        f3: function (msh) {
            this.meshes.add(msh.clone());
        },
        f4: function (mdl) {
            this.children.add(mdl.clone());
        }
    });

    Bridge.define("BNTest.ModelCache", {
        statics: {
            __this: null,
            config: {
                init: function () {
                    this.__this = new BNTest.ModelCache();
                }
            },
            get_this: function () {
                return BNTest.ModelCache.__this;
            }
        },
        data: null,
        config: {
            init: function () {
                this.data = new (System.Collections.Generic.Dictionary$2(String,BNTest.Model))();
            }
        },
        get: function (modelName, clone) {
            if (clone === void 0) { clone = true; }
            if (this.data.containsKey(modelName)) {
                if (!clone) {
                    return this.data.get(modelName);
                }
                return this.data.get(modelName).clone();
            }
            return null;
        },
        set: function (modelName, mesh) {
            var M = new BNTest.Model(mesh.getGD());
            M.meshes.add(mesh.clone());
            this.data.set(modelName, M);
        },
        set$1: function (modelName, model) {
            this.data.set(modelName, model.clone());
        }
    });

    Bridge.define("BNTest.NetPlay", {
        statics: {
            room_prefix: null,
            _this: null,
            config: {
                init: function () {
                    this.room_prefix = System.String.concat(System.String.concat("RSG_NetPlay_TouhouVoxelBattles", System.String.replaceAll(BNTest.App.gameVersion, ".", "_")), "_");
                }
            }
        },
        channel: null,
        /**
         * Fires when a new user connects to you.
         *
         * @instance
         * @public
         * @memberof BNTest.NetPlay
         * @type System.Action
         */
        onOpen: null,
        /**
         * Fires when the netplay closes.
         *
         * @instance
         * @public
         * @memberof BNTest.NetPlay
         * @type System.Action
         */
        onClose: null,
        /**
         * Fires when a networking error occurs.
         *
         * @instance
         * @public
         * @memberof BNTest.NetPlay
         * @type System.Action
         */
        onError: null,
        /**
         * Fires when a message is received a player.
         *
         * @instance
         * @public
         * @memberof BNTest.NetPlay
         * @type System.Action
         */
        onMessage: null,
        /**
         * Fires when a user disconnects.
         *
         * @instance
         * @public
         * @memberof BNTest.NetPlay
         * @type System.Action
         */
        onLeave: null,
        data: null,
        me: null,
        config: {
            properties: {
                users: null,
                roomID: null
            }
        },
        ctor: function (roomID, userName) {
            if (userName === void 0) { userName = null; }

            this.$initialize();
            this.setroomID(System.String.concat(BNTest.NetPlay.room_prefix, roomID));
            this.data = new (System.Collections.Generic.List$1(Object))();
            this.setusers(new (System.Collections.Generic.List$1(BNTest.NetPlayUser))());
            BNTest.NetPlay._this = this;
            if (userName != null) {
                userName = System.String.replaceAll(System.String.replaceAll(System.String.replaceAll(System.String.replaceAll(userName, ".", ""), " ", ""), "/", ""), "-", "");
                userName = System.String.concat(System.String.concat(System.String.concat("User-", userName), "-"), (((Bridge.Int.clip32(Math.random()) * 100000) | 0)));
            }

            this.init(userName);
        },
        getHoster: function () {
            return this.channel.isNewSessionOpened;
        },
        init: function (userName) {
            if (userName === void 0) { userName = null; }
            var self = this;
            var extras = {  };
            extras.firebase = "intense-torch-6778"; //Firebase app id.
            if (userName != null) {
                extras.userid = userName;
            }
            Bridge.Console.log(System.String.concat("NetPlay room:", this.getroomID()));
            //channel = Script.Write<dynamic>("new DataChannel(this.roomID)");
            this.channel = new DataChannel(self.roomID,extras);
            var ch = this.channel;
            ch.onopen = function (userId) {
                self._onOpen(userId);
            };
            ch.onleave = function (userId) {
                self._onLeave(userId);
            };
            ch.onclose = function (evt) {
                self._onClose(evt);
            };
            ch.onerror = function (evt) {
                self._onError(evt);
            };
            ch.onmessage = function (message, userId, latency) {
                self._onMessage(message, userId, latency);
            };

            ch.connect();

            this.me = new BNTest.NetPlayUser(this.channel.userid, true);
            this.getusers().add(this.me);

        },
        close: function () {
            this.channel.leave();
        },
        _onOpen: function (userID) {
            var user = this.getUserByName(userID, true);
            user.connected = true;
            if (this.onOpen) {
                this.onOpen(user);
            }
        },
        _onClose: function (evt) {
            if (this.onClose) {
                this.onClose(evt);
            }
        },
        _onError: function (evt) {
            //Global.Alert("DataChannel error:" + evt);
            Bridge.Console.log(System.String.concat("DataChannel error:", evt));
            if (this.onError) {
                this.onError(evt);
            }
        },
        _onMessage: function (message, userID, latency) {
            var user = this.getUserByName(userID, true);
            user.messagePosted();
            if (!this.onMessage) {
                return;
            }
            var L = message;
            var i = 0;
            while (i < L.length) {
                this.onMessage(L[i], user, latency);
                i = (i + 1) | 0;
            }
        },
        _onLeave: function (userID) {
            var user = this.getUserByName(userID, true);
            if (user != null) {
                user.connected = false;
                this.getusers().remove(user);
            }
            if (this.onLeave) {
                this.onLeave(user);
            }
        },
        send: function (message) {
            this.data.add(message);
        },
        flush: function () {
            if (this.data.getCount() > 0) {
                this.channel.send(this.data.toArray());
                this.data.clear();
            }
        },
        addUser: function (userID) {
            this.getUserByName(userID, true);
        },
        getUserByName: function (userID, autoCreate) {
            if (autoCreate === void 0) { autoCreate = false; }
            var L = new (System.Collections.Generic.List$1(BNTest.NetPlayUser))(System.Linq.Enumerable.from(this.getusers()).where(function (user) {
                return Bridge.referenceEquals(user.userID, userID);
            }));
            if (L.getCount() > 0) {
                return L.getItem(0);
            }
            if (autoCreate) {
                var ret = new BNTest.NetPlayUser(userID);
                this.getusers().add(ret);
                return ret;
            }
            return null;
        }
    });

    Bridge.define("BNTest.NetPlayUser", {
        userID: null,
        connected: false,
        _isMe: false,
        config: {
            init: function () {
                this.lastMessagePost = new Date(-864e13);
            }
        },
        ctor: function (userID, isMe) {
            if (isMe === void 0) { isMe = false; }

            this.$initialize();
            this.userID = userID;
            this.connected = true;
            this.lastMessagePost = new Date();
            this._isMe = isMe;
        },
        getIsMe: function () {
            return this._isMe;
        },
        gettimeSinceLastMessage: function () {
            return Bridge.Date.subdd(new Date(), this.lastMessagePost);
        },
        messagePosted: function () {
            this.lastMessagePost = new Date();
        },
        getName: function () {
            var parts = this.userID.split("-");
            if (parts.length > 2) {
                if (Bridge.referenceEquals(parts[0], "User")) {
                    return parts[1];
                }
            }
            return "";
        }
    });

    Bridge.define("BNTest.Octree", {
        children: null,
        nodeSize: 0,
        nodeDepth: 1,
        ctor: function (NodeSize, NodeDepth) {
            this.$initialize();
            this.children = new (System.Collections.Generic.List$1(BNTest.OctreeNode))();
            var sz = NodeSize;
            this.nodeDepth = NodeDepth;
            while (NodeDepth > 0) {
                sz = (sz + sz) | 0;
                NodeDepth = (NodeDepth - 1) | 0;
            }
            this.nodeSize = sz;
        },
        generateNode: function (X, Y, Z) {
            var ret = new BNTest.OctreeNode();
            var P = new BNTest.GLVec3.ctor(((X * this.nodeSize) | 0), ((Y * this.nodeSize) | 0), ((Z * this.nodeSize) | 0));
            ret.box = new BNTest.BoundingBox.$ctor1(P, BNTest.GLVec3.op_Addition(P, (BNTest.GLVec3.op_Multiply$1(BNTest.GLVec3.getOne(), this.nodeSize))));
            ret.makeSubdivisions$1(this.nodeDepth);
            this.children.add(ret);
            return ret;
        },
        getChild: function (Position) {
            var B = new BNTest.BoundingBox.$ctor1(Position, BNTest.GLVec3.op_Addition(Position, BNTest.GLVec3.getOne()));

            var L = System.Linq.Enumerable.from(this.children).where(function (ON) {
                return ON.box.intersection$2(B);
            }).toList(BNTest.OctreeNode);
            if (L.getCount() > 0) {
                return L.getItem(0);
            } else {
                var P = BNTest.GLVec3.floor(BNTest.GLVec3.op_Division$1(Position, this.nodeSize));

                return this.generateNode(Bridge.Int.clip32(P.x), Bridge.Int.clip32(P.y), Bridge.Int.clip32(P.z));
            }
        },
        getNodes: function (collision) {
            var ret = new (System.Collections.Generic.List$1(BNTest.OctreeNode))();
            {
                BNTest.HelperExtensions.forEach(BNTest.OctreeNode, this.children, function (ON) {
                    ret.addRange(ON.getNodes(collision));
                });
            }
            return ret;

        },
        getAllNodes: function () {
            var ret = new (System.Collections.Generic.List$1(BNTest.OctreeNode))();
            if (this.children != null) {
                BNTest.HelperExtensions.forEach(BNTest.OctreeNode, ret, function (ON) {
                    ret.addRange(ON.getAllNodes());
                });
            }
            return ret;
        },
        getBottomMostNodes: function () {
            var ret = new (System.Collections.Generic.List$1(BNTest.OctreeNode))();
            if (this.children != null) {
                BNTest.HelperExtensions.forEach(BNTest.OctreeNode, ret, function (ON) {
                    ret.addRange(ON.getAllNodes());
                });
            }
            return ret;
        },
        clear: function () {
            var L = this.getBottomMostNodes();
            BNTest.HelperExtensions.forEach(BNTest.OctreeNode, L, $_.BNTest.Octree.f1);
        },
        update: function (entitiesToPlace) {
            this.clear();
            BNTest.HelperExtensions.forEach(BNTest.Entity, entitiesToPlace, Bridge.fn.bind(this, $_.BNTest.Octree.f2));
        },
        placeEntity: function (E) {
            var L = this.getNodes(E.lastBB);
            if (L.getCount() === 0) {
                //Generates a child if one does not exist.
                var N = this.getChild(E.lastBB.min);
                BNTest.HelperExtensions.forEach(BNTest.OctreeNode, N.children, function (ON) {
                    L.addRange(ON.getNodes(E.lastBB));
                });
            }
            BNTest.HelperExtensions.forEach(BNTest.OctreeNode, L, function (ON) {
                BNTest.HelperExtensions.addIfNew(BNTest.Entity, ON.entities, E);
            });
        }
    });

    Bridge.ns("BNTest.Octree", $_);

    Bridge.apply($_.BNTest.Octree, {
        f1: function (ON) {
            ON.entities.clear();
        },
        f2: function (E) {
            this.placeEntity(E);
        }
    });

    Bridge.define("BNTest.OctreeNode", {
        box: null,
        children: null,
        entities: null,
        config: {
            init: function () {
                this.entities = new (System.Collections.Generic.List$1(BNTest.Entity))();
            }
        },
        /**
         * 
         *
         * @instance
         * @public
         * @this BNTest.OctreeNode
         * @memberof BNTest.OctreeNode
         * @param   {number}    depth    The recursive level to keep subdividing.
         * @return  {void}
         */
        makeSubdivisions$1: function (depth) {
            if (depth > 0) {
                depth = (depth - 1) | 0;
                this.makeSubdivisions();
                if (depth > 0) {
                    BNTest.HelperExtensions.forEach(BNTest.OctreeNode, this.children, function (ON) {
                        ON.makeSubdivisions$1(((depth - 1) | 0));
                    });
                }
            }
        },
        makeSubdivisions: function () {
            if (this.children == null && this.box != null) {
                this.children = new (System.Collections.Generic.List$1(BNTest.OctreeNode))();
                var B = this.box.clone();
                B.setSize(BNTest.GLVec3.op_Multiply$1(B.getSize(), 0.5));
                var Sz = B.getSize();
                //var i = 0;

                var ON = null;


                ON = new BNTest.OctreeNode();
                ON.box = B.clone();
                this.children.add(ON);

                ON = new BNTest.OctreeNode();
                ON.box = BNTest.BoundingBox.op_Addition(B, new BNTest.GLVec3.ctor(Sz.x, 0, 0));
                this.children.add(ON);

                ON = new BNTest.OctreeNode();
                ON.box = BNTest.BoundingBox.op_Addition(B, new BNTest.GLVec3.ctor(0, 0, Sz.z));
                this.children.add(ON);

                ON = new BNTest.OctreeNode();
                ON.box = BNTest.BoundingBox.op_Addition(B, new BNTest.GLVec3.ctor(Sz.x, 0, Sz.z));
                this.children.add(ON);

                ON = new BNTest.OctreeNode();
                ON.box = BNTest.BoundingBox.op_Addition(B, new BNTest.GLVec3.ctor(Sz.x, Sz.y, 0));
                this.children.add(ON);

                ON = new BNTest.OctreeNode();
                ON.box = BNTest.BoundingBox.op_Addition(B, new BNTest.GLVec3.ctor(Sz.x, Sz.y, 0));
                this.children.add(ON);

                ON = new BNTest.OctreeNode();
                ON.box = BNTest.BoundingBox.op_Addition(B, new BNTest.GLVec3.ctor(0, Sz.y, Sz.z));
                this.children.add(ON);

                ON = new BNTest.OctreeNode();
                ON.box = BNTest.BoundingBox.op_Addition(B, new BNTest.GLVec3.ctor(Sz.x, Sz.y, Sz.z));
                this.children.add(ON);
            }
        },
        findCollisions: function (collision) {
            var ret = new (System.Collections.Generic.List$1(BNTest.Entity))();
            var N = this.getNodes(collision);

            BNTest.HelperExtensions.forEach(BNTest.OctreeNode, N, function (ON) {
                BNTest.HelperExtensions.forEach(BNTest.Entity, ON.entities, function (E) {
                    if (E.lastBB.intersection$2(collision)) {
                        BNTest.HelperExtensions.addIfNew(BNTest.Entity, ret, E);
                    }
                });
            });

            return ret;
        },
        getAllNodes: function () {
            var ret = new (System.Collections.Generic.List$1(BNTest.OctreeNode))();
            ret.add(this);
            if (this.children != null) {
                BNTest.HelperExtensions.forEach(BNTest.OctreeNode, ret, function (ON) {
                    ret.addRange(ON.getAllNodes());
                });
            }
            return ret;
        },
        getBottomMostNodes: function () {
            var ret = new (System.Collections.Generic.List$1(BNTest.OctreeNode))();
            if (this.children != null) {
                BNTest.HelperExtensions.forEach(BNTest.OctreeNode, ret, function (ON) {
                    ret.addRange(ON.getAllNodes());
                });
            } else {
                ret.add(this);
            }
            return ret;
        },
        getNodes: function (collision) {
            var ret = new (System.Collections.Generic.List$1(BNTest.OctreeNode))();
            if (this.box == null || this.box.intersection$2(collision)) {
                if (this.children == null) {
                    ret.add(this);
                } else {
                    BNTest.HelperExtensions.forEach(BNTest.OctreeNode, this.children, function (ON) {
                        ret.addRange(ON.getNodes(collision));
                    });
                }
            }
            return ret;

        }
    });

    Bridge.define("BNTest.Player", {
        ID: 0,
        character: null,
        networkID: null,
        score: 0,
        CPU: false,
        lives: 3,
        minion: false,
        config: {
            properties: {
                local: false
            }
        },
        ctor: function (local, CPU, minion) {
            if (minion === void 0) { minion = false; }

            this.$initialize();
            //this.Character = character;
            this.setlocal(local);
            this.CPU = CPU;
            this.minion = minion;
        }
    });

    Bridge.define("BNTest.Rectangle", {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        ctor: function (x, y, width, height) {
            if (x === void 0) { x = 0.0; }
            if (y === void 0) { y = 0.0; }
            if (width === void 0) { width = 0.0; }
            if (height === void 0) { height = 0.0; }

            this.$initialize();
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        },
        getleft: function () {
            return this.x;
        },
        setleft: function (value) {
            this.x = value;
        },
        gettop: function () {
            return this.y;
        },
        settop: function (value) {
            this.y = value;
        },
        getright: function () {
            return this.x + this.width;
        },
        setright: function (value) {
            this.width = value - this.x;
        },
        getbottom: function () {
            return this.y + this.height;
        },
        setbottom: function (value) {
            this.height = value - this.y;
        },
        getpoints: function () {
            var ret = System.Array.init(8, 0);
            var i = 0;
            ret[Bridge.identity(i, (i = (i + 1) | 0))] = this.x;
            ret[Bridge.identity(i, (i = (i + 1) | 0))] = this.y;

            ret[Bridge.identity(i, (i = (i + 1) | 0))] = this.getright();
            ret[Bridge.identity(i, (i = (i + 1) | 0))] = this.y;

            ret[Bridge.identity(i, (i = (i + 1) | 0))] = this.getright();
            ret[Bridge.identity(i, (i = (i + 1) | 0))] = this.getbottom();

            ret[Bridge.identity(i, (i = (i + 1) | 0))] = this.x;
            ret[Bridge.identity(i, (i = (i + 1) | 0))] = this.getbottom();

            return ret;
        },
        getCenter: function () {
            return new BNTest.Vector2(this.getleft() + (this.width / 2), this.gettop() + (this.height / 2));
        },
        getMin: function () {
            return new BNTest.Vector2(this.x, this.y);
        },
        setMin: function (value) {
            if (BNTest.Vector2.op_Equality(value, null)) {
                return;
            }
            this.x = value.x;
            this.y = value.y;
        },
        getMax: function () {
            return new BNTest.Vector2(this.getright(), this.getbottom());
        },
        setMax: function (value) {
            if (BNTest.Vector2.op_Equality(value, null)) {
                return;
            }
            this.setright(value.x);
            this.setbottom(value.y);
        },
        containsPoint$1: function (x, y) {
            if (x >= this.x && y >= this.y && x <= this.getright() && y <= this.getbottom()) {
                return true;
            }
            return false;
        },
        containsPoint: function (point) {
            if (point.x >= this.x && point.y >= this.y && point.x <= this.getright() && point.y <= this.getbottom()) {
                return true;
            }
            return false;
        },
        intersects: function (R) {
            var p = R.getpoints();
            var contain = false;
            var outside = false;
            var i = 0;
            while (i < p.length) {
                if (this.containsPoint$1(p[Bridge.identity(i, (i = (i + 1) | 0))], p[Bridge.identity(i, (i = (i + 1) | 0))])) {
                    contain = true;
                } else {
                    outside = true;
                }
            }
            if (contain && outside) {
                return true;
            }
            if (R.getleft() < this.getleft() && R.getright() > this.getright()) {
                //if ((top <= R.top && bottom <= R.top) || (top <= R.bottom && bottom <= R.bottom))
                if ((this.gettop() <= R.gettop() && this.getbottom() >= R.gettop()) || (this.gettop() <= R.getbottom() && this.getbottom() >= R.getbottom())) {
                    return true;
                }
            }
            if (R.gettop() < this.gettop() && R.getbottom() > this.getbottom()) {
                if ((this.getleft() <= R.getleft() && this.getright() >= R.getleft()) || (this.getleft() <= R.getright() && this.getright() >= R.getright())) {
                    return true;
                }
            }
            /* if (R.left < left && R.right > right)
                {
                    if ((top <= R.top && bottom <= R.top) || (top <= R.bottom && bottom <= R.bottom))
                    {
                        return true;
                    }
                }
                if (R.top < top && R.bottom > bottom)
                {
                    if ((left <= R.left && right <= R.left) || (left <= R.right && right <= R.right))
                    {
                        return true;
                    }
                }*/
            return false;
        },
        isTouching: function (R) {
            if (R == null) {
                return false;
            }
            var p = R.getpoints();
            var i = 0;
            while (i < p.length) {
                if (this.containsPoint$1(p[Bridge.identity(i, (i = (i + 1) | 0))], p[Bridge.identity(i, (i = (i + 1) | 0))])) {
                    return true;
                }
            }
            if (this.intersects(R)) {
                return true;
            }
            /* if (R.left < left && R.right > right)
                {
                    if ((top<=R.top && bottom<=R.top) || (top <= R.bottom && bottom <= R.bottom))
                    {
                        return true;
                    }
                }
                if (R.top < top && R.bottom > bottom)
                {
                    if ((left <= R.left && right <= R.left) || (left <= R.right && right <= R.right))
                    {
                        return true;
                    }
                }*/
            return false;
        }
    });

    Bridge.define("BNTest.Sprite", {
        position: null,
        spriteBuffer: null,
        visible: true,
        spriteGraphics: null,
        ctor: function () {
            this.$initialize();
            this.spriteBuffer = document.createElement('canvas');
            this.spriteGraphics = this.spriteBuffer.getContext("2d");
            this.position = new BNTest.Vector2();
        },
        getSize: function () {
            return new BNTest.Vector2(this.spriteBuffer.width, this.spriteBuffer.height);
        },
        setSize: function (value) {
            if (BNTest.Vector2.op_Equality(value, null)) {
                value = new BNTest.Vector2();
            }
            this.spriteBuffer.width = Bridge.Int.clip32(value.x);
            this.spriteBuffer.height = Bridge.Int.clip32(value.y);
        },
        getGraphics: function () {
            return this.spriteGraphics;
        },
        onFrame: function () {

        },
        draw: function (g) {
            if (!this.visible) {
                return;
            }
            g.drawImage(this.spriteBuffer, this.position.x, this.position.y);
        },
        getBounds: function () {
            return new BNTest.Rectangle(this.position.x, this.position.y, this.spriteBuffer.width, this.spriteBuffer.height);
        }
    });

    Bridge.define("BNTest.TextureLoader", {
        statics: {
            createTexture: function (gl, img) {
                var texture = gl.createTexture();

                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.bindTexture(gl.TEXTURE_2D, null);
                return texture;
            }
        },
        gl: null,
        textures: null,
        images: null,
        loading: null,
        config: {
            init: function () {
                this.textures = new (System.Collections.Generic.Dictionary$2(HTMLImageElement,Bridge.WebGL.WebGLTexture))();
                this.images = new (System.Collections.Generic.Dictionary$2(String,HTMLImageElement))();
                this.loading = new (System.Collections.Generic.List$1(HTMLImageElement))();
            }
        },
        get$1: function (path, callback) {
            if (this.images.containsKey(path) && !this.loading.contains(this.images.get(path))) {
                callback(this.get(this.images.get(path)));
            } else {
                var I = this.getImage(path);
                I.onload = Bridge.fn.bind(this, function (E) {
                    this.loading.remove(E.currentTarget);
                    callback(this.get(I));
                });
            }
        },
        get: function (image) {
            if (this.textures.containsKey(image)) {
                return this.textures.get(image);
            } else {
                var ret = BNTest.TextureLoader.createTexture(this.gl, image);
                this.textures.set(image, ret);
                return ret;
            }
        },
        getImage: function (path) {
            if (this.images.containsKey(path)) {
                return this.images.get(path);
            } else {
                var ret = new Image();
                ret.src = path;
                this.images.set(path, ret);
                this.loading.add(ret);
                ret.onload = Bridge.fn.bind(this, $_.BNTest.TextureLoader.f1);
                return ret;
            }
        }
    });

    Bridge.ns("BNTest.TextureLoader", $_);

    Bridge.apply($_.BNTest.TextureLoader, {
        f1: function (E) {
            this.loading.remove(E.currentTarget);
        }
    });

    Bridge.define("BNTest.Vector2", {
        statics: {
            getEmpty: function () {
                return new BNTest.Vector2();
            },
            fromRadian: function (radian) {
                return BNTest.MathHelper.radianToVector(radian);
            },
            op_Equality: function (A, B) {
                var OA = A;
                var OB = B;
                if ((OA == null || OB == null) && (OA != null || OB != null)) {
                    return false;
                }
                if (OA == null && OB == null) {
                    return true;
                }
                return A.x === B.x && A.y === B.y;
                //return false;
                if (!Bridge.referenceEquals(A, B) && (BNTest.Vector2.op_Equality(A, null) || BNTest.Vector2.op_Equality(B, null))) {
                    return false;
                }
                return (A.x === B.x && A.y === B.y);
                return (!Bridge.referenceEquals(A, B)) || (A.x === B.x && A.y === B.y);
            },
            op_Inequality: function (A, B) {
                return !(BNTest.Vector2.op_Equality(A, B));
                if (!Bridge.referenceEquals(A, B) && (BNTest.Vector2.op_Equality(A, null) || BNTest.Vector2.op_Equality(B, null))) {
                    return true;
                }
                return !(A.x === B.x && A.y === B.y);
                return !((!Bridge.referenceEquals(A, B)) || (A.x === B.x && A.y === B.y));
            },
            op_Multiply: function (A, scale) {
                return new BNTest.Vector2(A.x * scale, A.y * scale);
            },
            op_Division: function (A, scale) {
                return new BNTest.Vector2(A.x / scale, A.y / scale);
            },
            op_Addition: function (A, B) {
                return new BNTest.Vector2(A.x + B.x, A.y + B.y);
            },
            op_Subtraction: function (A, B) {
                return new BNTest.Vector2(A.x - B.x, A.y - B.y);
            }
        },
        x: 0,
        y: 0,
        ctor: function (x, y) {
            if (x === void 0) { x = 0.0; }
            if (y === void 0) { y = 0.0; }

            this.$initialize();
            this.x = x;
            this.y = y;
        },
        getLength: function () {
            return Math.sqrt((this.x * this.x) + (this.y * this.y));
        },
        /**
         * Returns a rough estimate of the vector's length.
         *
         * @instance
         * @public
         * @this BNTest.Vector2
         * @memberof BNTest.Vector2
         * @function getEstimatedLength
         * @return  {number}
         */
        /**
         * Returns a rough estimate of the vector's length.
         *
         * @instance
         * @function setEstimatedLength
         */
        getEstimatedLength: function () {
            var A = Math.abs(this.x);
            var B = Math.abs(this.y);
            if (B > A) {
                var tmp = A;
                A = B;
                B = tmp;
            }
            B *= 0.34;
            return (A + B);
            //return (float)(Math.Abs(X) + Math.Abs(Y));
        },
        /**
         * Returns the sum of its absolute parts.
         *
         * @instance
         * @public
         * @this BNTest.Vector2
         * @memberof BNTest.Vector2
         * @function getRoughLength
         * @return  {number}
         */
        /**
         * Returns the sum of its absolute parts.
         *
         * @instance
         * @function setRoughLength
         */
        getRoughLength: function () {
            return (Math.abs(this.x) + Math.abs(this.y));
        },
        roughNormalize: function (length) {
            if (length === void 0) { length = 1.0; }
            var D = this.getLength() / length;
            return new BNTest.Vector2(this.x / D, this.y / D);
        },
        normalize: function (length) {
            if (length === void 0) { length = 1.0; }
            var distance = Math.sqrt(this.x * this.x + this.y * this.y);
            var V = new BNTest.Vector2();
            V.x = this.x / distance;
            V.y = this.y / distance;
            V.x *= length;
            V.y *= length;
            return V;
        },
        toCardinal: function () {
            var x = this.x;
            var y = this.y;
            var A = Math.abs(this.x);
            var B = Math.abs(this.y);
            if (B > A) {
                x = 0;
            } else if (A > B) {
                y = 0;
            }
            return new BNTest.Vector2(x, y);
        },
        equals: function (o) {
            if (Bridge.is(o, BNTest.Vector2)) {
                var B = Bridge.cast(o, BNTest.Vector2);
                if (BNTest.Vector2.op_Inequality(this, B) && BNTest.Vector2.op_Equality(B, null)) {
                    return false;
                }
                return B.x === this.x && B.y === this.y;
            }
            return Bridge.equals(this, o);
        },
        toAngle: function () {
            return BNTest.MathHelper.wrapRadians(BNTest.MathHelper.getAngle(new BNTest.Vector2(), this));
        },
        clone: function () {
            return new BNTest.Vector2(this.x, this.y);
        },
        rotate: function (radian) {
            var angle = this.toAngle() + radian;
            return BNTest.Vector2.fromRadian(angle).normalize(this.getLength());
        }
    });

    Bridge.define("BNTest.VoxelMap", {
        statics: {
            maps: null,
            config: {
                init: function () {
                    this.maps = new (System.Collections.Generic.Dictionary$2(String,BNTest.VoxelMap))();
                }
            },
            generateTree: function (size, color, smoothness) {
                if (smoothness === void 0) { smoothness = 0.95; }
                var hsz = (Bridge.Int.div(size, 2)) | 0;
                var hhsz = (Bridge.Int.div(hsz, 2)) | 0;
                var VM = new BNTest.VoxelMap();
                VM.map = System.Array.create(null, null, hsz, size, hsz);
                var S = new BNTest.GLVec3.ctor(((hhsz - 1) | 0), ((size - 1) | 0), hhsz);
                var E = S.clone();
                E.y = 0;
                //VM.DrawMessyLine(S, E, 1, (E - S).Normalize(3), color);
                VM.drawMessyGrowLine(S, E, 1, (BNTest.GLVec3.op_Subtraction(E, S)).normalize(10), color, (((((Bridge.Int.div(hhsz, 4)) | 0)) - 1) | 0), smoothness, true);
                VM.grow(Bridge.Int.clip32(S.x), Bridge.Int.clip32(S.y), Bridge.Int.clip32(S.z), color, ((Bridge.Int.clip32(hhsz / 3.5) - 1) | 0), smoothness, true, false);
                VM.outline(color, true, 1);
                return VM;
            },
            generateRock: function (size, color, smoothness) {
                if (smoothness === void 0) { smoothness = 0.9; }
                var hsz = (Bridge.Int.div(size, 2)) | 0;
                var VM = new BNTest.VoxelMap();
                VM.map = System.Array.create(null, null, size, hsz, size);
                //VM.Map = new GLColor[hsz, hsz, hsz];
                //VM.DrawPyramid(0, hsz / 2, 0, (int)Math.Round(hsz * 0.75), color);
                VM.drawPyramid(0, 0, 0, hsz, color);
                /* VM.SetVoxel(hsz - 1, hsz - 1, hsz - 1, color);
                size += size + size;
                //var i = hsz - 1;
                var i = size - 1;
                while (i > 0)
                {
                    VM.Outline(color, false, smoothness);
                    i--;
                }

                i = (size / 3);
                while (i > 0)
                {
                    VM.Outline(color, true, smoothness);
                    i--;
                }*/
                return VM;
                /* VoxelMap VM = new VoxelMap();
                VM.Map = new GLColor[size, size, size];
                var hsz = size / 2;
                VM.SetVoxel(hsz - 1, size - 1, hsz - 1, color);
                //var i = hsz - 1;
                var i = size - 1;
                while (i > 0)
                {
                    VM.Outline(color, false, smoothness);
                    if ((i & 1) > 0)
                    {
                        VM.Outline(color, true, smoothness);
                    }
                    i--;
                }
                return VM;*/
            },
            fromAnimationCombo: function (animations) {
                if (animations === void 0) { animations = []; }
                var S = animations[0];
                var i = 1;
                while (i < animations.length) {
                    S = System.String.concat(System.String.concat(S, "|"), animations[i]);
                    i = (i + 1) | 0;
                }
                return BNTest.VoxelMap.fromImages$1(S);
            },
            fromImages$1: function (animation) {
                if (BNTest.VoxelMap.maps.containsKey(animation)) {
                    return BNTest.VoxelMap.maps.get(animation).clone();
                } else {
                    if (System.String.contains(animation,"|")) {
                        var An = animation.split("|");
                        var i = 0;
                        var ret = null;
                        while (i < An.length) {
                            var VM = BNTest.VoxelMap.fromImages$1(An[i]);
                            if (ret == null) {
                                ret = VM;
                            } else {
                                ret.combine(VM);
                            }
                            i = (i + 1) | 0;
                        }
                        return ret;
                    }
                    var A = BNTest.VoxelMap.fromImages(BNTest.AnimationLoader.get(animation));
                    BNTest.VoxelMap.maps.set(animation, A);
                    return A.clone();
                }
            },
            fromImages: function (images) {
                var ret = new BNTest.VoxelMap();
                var ln = images.getCount();
                ret.map = System.Array.create(null, null, images.getItem(0).width, images.getItem(0).height, ln);
                var i = 0;
                while (i < ln) {
                    ret.importImageLayer(images.getItem(i), i);
                    i = (i + 1) | 0;
                }
                return ret;
            },
            gen: function (size, sizey, sizez, holes, transparent, bottomsolid, winter) {
                if (size === void 0) { size = 2; }
                if (sizey === void 0) { sizey = 0; }
                if (sizez === void 0) { sizez = 0; }
                if (holes === void 0) { holes = true; }
                if (transparent === void 0) { transparent = true; }
                if (bottomsolid === void 0) { bottomsolid = false; }
                if (winter === void 0) { winter = false; }
                if (sizey === 0) {
                    sizey = size;
                }
                if (sizez === 0) {
                    sizez = size;
                }
                var ret = new BNTest.VoxelMap();
                ret.map = System.Array.create(null, null, size, sizey, sizez);
                ret.randomize(holes, transparent, bottomsolid, winter);
                return ret;
            },
            sameSize: function (A, B) {
                if (System.Array.getLength(A.map, 0) === System.Array.getLength(B.map, 0) && System.Array.getLength(A.map, 1) === System.Array.getLength(B.map, 1) && System.Array.getLength(A.map, 2) === System.Array.getLength(B.map, 2)) {
                    return true;
                }
                return false;
            },
            getMaxSize: function (A, B) {
                var ret = [Math.max(System.Array.getLength(A.map, 0), System.Array.getLength(B.map, 0)), Math.max(System.Array.getLength(A.map, 1), System.Array.getLength(B.map, 1)), Math.max(System.Array.getLength(A.map, 2), System.Array.getLength(B.map, 2))];
                return ret;
            }
        },
        map: null,
        getVoxel: function (X, Y, Z) {
            if (X >= 0 && Y >= 0 && Z >= 0 && X < System.Array.getLength(this.map, 0) && Y < System.Array.getLength(this.map, 1) && Z < System.Array.getLength(this.map, 2)) {
                return this.map.get([X, Y, Z]);
            }
            return null;
        },
        inBounds: function (X, Y, Z) {
            if (X >= 0 && Y >= 0 && Z >= 0 && X < System.Array.getLength(this.map, 0) && Y < System.Array.getLength(this.map, 1) && Z < System.Array.getLength(this.map, 2)) {
                return true;
            }
            return false;
        },
        randomize: function (holes, transparent, bottomsolid, winter) {
            if (holes === void 0) { holes = true; }
            if (transparent === void 0) { transparent = true; }
            if (bottomsolid === void 0) { bottomsolid = false; }
            if (winter === void 0) { winter = false; }
            var X = 0;
            var Y = 0;
            var Z = 0;
            while (X < System.Array.getLength(this.map, 0)) {
                while (Y < System.Array.getLength(this.map, 1)) {
                    while (Z < System.Array.getLength(this.map, 2)) {
                        //GLColor C = GLColor.Random();
                        var C = null;
                        if (!winter) {
                            C = BNTest.GLColor.randomB(0, 0.6, 0.1, 0.3, 0.9, 0.4);
                        } else {
                            C = BNTest.GLColor.randomB(0.77, 0.82, 0.87, 0.87, 0.92, 1.0);
                        }
                        var ok = Y < ((System.Array.getLength(this.map, 1) - 1) | 0) || !bottomsolid;
                        if (Math.random() < 0.3 && holes && ok) {
                            C.a = 0;
                        } else if (Math.random() < 0.4 && transparent && ok) {
                            //C.A = Math.Random();
                            C.a = 0.5;
                        }
                        this.map.set([X, Y, Z], C);
                        Z = (Z + 1) | 0;
                    }
                    Z = 0;
                    Y = (Y + 1) | 0;
                }
                Y = 0;
                Z = 0;
                X = (X + 1) | 0;
            }
        },
        setColor: function (color) {
            var X = 0;
            var Y = 0;
            var Z = 0;
            while (X < System.Array.getLength(this.map, 0)) {
                while (Y < System.Array.getLength(this.map, 1)) {
                    while (Z < System.Array.getLength(this.map, 2)) {
                        if (this.valid(this.map.get([X, Y, Z]))) {
                            this.map.set([X, Y, Z], color);
                        }
                        Z = (Z + 1) | 0;
                    }
                    Z = 0;
                    Y = (Y + 1) | 0;
                }
                Y = 0;
                Z = 0;
                X = (X + 1) | 0;
            }
        },
        flipX: function () {
            var N = System.Array.create(null, null, System.Array.getLength(this.map, 0), System.Array.getLength(this.map, 1), System.Array.getLength(this.map, 2));
            var X = 0;
            var Y = 0;
            var Z = 0;
            while (X < System.Array.getLength(this.map, 0)) {
                while (Y < System.Array.getLength(this.map, 1)) {
                    while (Z < System.Array.getLength(this.map, 2)) {
                        N.set([((System.Array.getLength(this.map, 0) - (((X + 1) | 0))) | 0), Y, Z], this.map.get([X, Y, Z]));
                        Z = (Z + 1) | 0;
                    }
                    Z = 0;
                    Y = (Y + 1) | 0;
                }
                Y = 0;
                Z = 0;
                X = (X + 1) | 0;
            }
            this.map = N;
        },
        flatten: function () {
            var MX = System.Array.getLength(this.map, 0);
            var MY = System.Array.getLength(this.map, 1);
            var MZ = System.Array.getLength(this.map, 2);
            var N = System.Array.create(null, null, MX, 1, MZ);
            var X = 0;
            var Y = 0;
            var Z = 0;

            while (X < MX) {
                while (Y < MY) {
                    while (Z < MZ) {
                        N.set([X, 0, Z], this.map.get([X, Y, Z]));
                        Z = (Z + 1) | 0;
                    }
                    Z = 0;
                    Y = (Y + 1) | 0;
                }
                Y = 0;
                Z = 0;
                X = (X + 1) | 0;
            }
            this.map = N;
        },
        addStripes: function (strength, coverage, verticalStride) {
            if (coverage === void 0) { coverage = 1.0; }
            if (verticalStride === void 0) { verticalStride = 0; }
            //GLColor[,,] N = new GLColor[Map.GetLength(0), Map.GetLength(1), Map.GetLength(2)];
            var X = 0;
            var Y = 0;
            var Z = 0;
            var MX = System.Array.getLength(this.map, 0);
            var MY = System.Array.getLength(this.map, 1);
            var MZ = System.Array.getLength(this.map, 2);
            var m2 = strength + strength;
            while (X < MX) {
                while (Y < MY) {
                    while (Z < MZ) {
                        var C = this.map.get([X, Y, Z]);
                        if (this.valid(C) && ((X & 1) > 0 || (Z & 1) > 0 || (verticalStride > 0 && ((((((Y + X) | 0) + Z) | 0)) % verticalStride === 0))) && (coverage >= 1 || Math.random() > coverage)) {
                            C = BNTest.GLColor.op_Multiply(C, (1 - strength));
                            this.map.set([X, Y, Z], C);
                        }
                        Z = (Z + 1) | 0;
                        //Z++;
                    }
                    Z = 0;
                    Y = (Y + 1) | 0;
                }
                Y = 0;
                Z = 0;
                X = (X + 1) | 0;
                //X++;
            }
            //Map = N;
        },
        addNoise: function (strength, coverage) {
            if (coverage === void 0) { coverage = 1.0; }
            //GLColor[,,] N = new GLColor[Map.GetLength(0), Map.GetLength(1), Map.GetLength(2)];
            var X = 0;
            var Y = 0;
            var Z = 0;
            var m2 = strength + strength;
            var MX = System.Array.getLength(this.map, 0);
            var MY = System.Array.getLength(this.map, 1);
            var MZ = System.Array.getLength(this.map, 2);
            while (X < MX) {
                while (Y < MY) {
                    while (Z < MZ) {
                        var C = this.map.get([X, Y, Z]);
                        if (this.valid(C) && (coverage >= 1 || Math.random() > coverage)) {
                            C = BNTest.GLColor.op_Addition(C, new BNTest.GLColor(-strength + (m2 * Math.random()), -strength + (m2 * Math.random()), -strength + (m2 * Math.random())));
                            this.map.set([X, Y, Z], C);
                        }
                        Z = (Z + 1) | 0;
                    }
                    Z = 0;
                    Y = (Y + 1) | 0;
                }
                Y = 0;
                Z = 0;
                X = (X + 1) | 0;
            }
            //Map = N;
        },
        drawGrowLine: function (start, end, color, Depth, chance, corners) {
            if (chance === void 0) { chance = 1.0; }
            if (corners === void 0) { corners = false; }
            var V = start.clone();
            var spd = BNTest.GLVec3.op_Subtraction(end, start);
            var len = spd.getLength();
            spd = spd.normalize(1);
            var i = 0;
            while (i < len) {
                //SetVoxel(V, color);
                this.grow(Bridge.Int.clip32(V.x), Bridge.Int.clip32(V.y), Bridge.Int.clip32(V.z), color, Depth, chance, corners);
                V = BNTest.GLVec3.op_Addition(V, spd);
                i = (i + 1) | 0;
            }
        },
        drawLine: function (start, end, color) {
            var V = start.clone();
            var spd = BNTest.GLVec3.op_Subtraction(end, start);
            var len = spd.getLength();
            spd = spd.normalize(1);
            var i = 0;
            while (i < len) {
                this.setVoxel(V, color);
                V = BNTest.GLVec3.op_Addition(V, spd);
                i = (i + 1) | 0;
            }
        },
        addHoles: function (chance) {
            var X = 0;
            var Y = 0;
            var Z = 0;
            while (X < System.Array.getLength(this.map, 0)) {
                while (Y < System.Array.getLength(this.map, 1)) {
                    while (Z < System.Array.getLength(this.map, 2)) {
                        var C = this.map.get([X, Y, Z]);
                        if (Math.random() < chance) {
                            this.map.set([X, Y, Z], null);
                        }
                        Z = (Z + 1) | 0;
                    }
                    Z = 0;
                    Y = (Y + 1) | 0;
                }
                Y = 0;
                Z = 0;
                X = (X + 1) | 0;
            }
        },
        drawMessyGrowLine: function (start, generalDestination, maxSegmentLength, momentum, color, Depth, chance, corners) {
            if (chance === void 0) { chance = 1.0; }
            if (corners === void 0) { corners = false; }
            var V = start.clone();
            var dist = BNTest.GLVec3.op_Subtraction(generalDestination, start);
            var len = dist.getLength();
            var total = len * 1.1;

            var i = 0;
            var msl2 = maxSegmentLength + maxSegmentLength;
            var hsz = BNTest.GLVec3.createUniform(msl2);
            var tries = 0;
            var maxTries = 20;
            while (i < total && tries < maxTries) {
                var line = new BNTest.GLVec3.ctor(-maxSegmentLength + (Math.random() * msl2), -maxSegmentLength + (Math.random() * msl2), -maxSegmentLength + (Math.random() * msl2));

                var N = BNTest.GLVec3.op_Addition(V, line);
                var ND = (BNTest.GLVec3.op_Subtraction(generalDestination, N)).getLength();
                tries = (tries + 1) | 0;
                if (ND < len) {
                    tries = 0;
                    if (momentum != null) {
                        line = BNTest.GLVec3.op_Addition(line, momentum);

                        N = BNTest.GLVec3.op_Addition(V, line);
                        ND = (BNTest.GLVec3.op_Subtraction(generalDestination, N)).getLength();
                    }
                    var LL = line.getLength();
                    this.drawGrowLine(V, N, color, Depth, chance, corners);
                    V = N;
                    len = ND;
                    //i += LL;
                    i += LL;
                }
            }
        },
        drawMessyLine: function (start, generalDestination, maxSegmentLength, momentum, color) {
            var V = start.clone();
            var dist = BNTest.GLVec3.op_Subtraction(generalDestination, start);
            var len = dist.getLength();
            var total = len;

            var i = 0;
            var msl2 = maxSegmentLength + maxSegmentLength;
            var hsz = BNTest.GLVec3.createUniform(msl2);
            var tries = 0;
            var maxTries = 20;
            while (i < total && tries < maxTries) {
                var line = new BNTest.GLVec3.ctor(-maxSegmentLength + (Math.random() * msl2), -maxSegmentLength + (Math.random() * msl2), -maxSegmentLength + (Math.random() * msl2));

                var N = BNTest.GLVec3.op_Addition(V, line);
                var ND = (BNTest.GLVec3.op_Subtraction(generalDestination, N)).getLength();
                tries = (tries + 1) | 0;
                if (ND < len) {
                    tries = 0;
                    var LL = line.getLength();
                    if (momentum != null) {
                        line = BNTest.GLVec3.op_Addition(line, momentum);

                        N = BNTest.GLVec3.op_Addition(V, line);
                        ND = (BNTest.GLVec3.op_Subtraction(generalDestination, N)).getLength();
                    }
                    this.drawLine(V, N, color);
                    V = N;
                    len = ND;
                    //i += LL;
                    i += LL;
                }
            }
        },
        drawPyramid: function (X, Y, Z, size, color) {
            var XX = X;
            var YY = (Y + (((size - 1) | 0))) | 0;
            var ZZ = Z;
            while (size > 0) {
                this.fill$1(XX, YY, ZZ, size, 1, size, color);
                XX = (XX + 1) | 0;
                ZZ = (ZZ + 1) | 0;
                YY = (YY - 1) | 0;
                size = (size - 2) | 0;
            }
        },
        grow: function (X, Y, Z, color, Depth, chance, first, corners) {
            if (chance === void 0) { chance = 1.0; }
            if (first === void 0) { first = true; }
            if (corners === void 0) { corners = false; }
            if (!this.inBounds(X, Y, Z)) {
                return;
            }
            this.setVoxel$1(X, Y, Z, color);
            Depth = (Depth - 1) | 0;
            if ((first || (chance >= 1 || Math.random() < chance)) && Depth > 0) {
                this.grow(((X - 1) | 0), Y, Z, color, Depth, chance, false, corners);
                this.grow(X, ((Y - 1) | 0), Z, color, Depth, chance, false, corners);
                this.grow(X, Y, ((Z - 1) | 0), color, Depth, chance, false, corners);

                this.grow(((X + 1) | 0), Y, Z, color, Depth, chance, false, corners);
                this.grow(X, ((Y + 1) | 0), Z, color, Depth, chance, false, corners);
                this.grow(X, Y, ((Z + 1) | 0), color, Depth, chance, false, corners);

                if (corners) {
                    this.grow(((X - 1) | 0), ((Y - 1) | 0), ((Z - 1) | 0), color, Depth, chance, false, corners);
                    this.grow(((X + 1) | 0), ((Y - 1) | 0), ((Z - 1) | 0), color, Depth, chance, false, corners);

                    this.grow(((X - 1) | 0), ((Y - 1) | 0), ((Z + 1) | 0), color, Depth, chance, false, corners);
                    this.grow(((X + 1) | 0), ((Y - 1) | 0), ((Z + 1) | 0), color, Depth, chance, false, corners);
                    this.grow(((X - 1) | 0), ((Y + 1) | 0), ((Z - 1) | 0), color, Depth, chance, false, corners);
                    this.grow(((X + 1) | 0), ((Y + 1) | 0), ((Z - 1) | 0), color, Depth, chance, false, corners);

                    this.grow(((X - 1) | 0), ((Y + 1) | 0), ((Z + 1) | 0), color, Depth, chance, false, corners);
                    this.grow(((X + 1) | 0), ((Y + 1) | 0), ((Z + 1) | 0), color, Depth, chance, false, corners);
                }
            }
        },
        /**
         * fills all empty voxels that have adjacent filled ones.
         *
         * @instance
         * @public
         * @this BNTest.VoxelMap
         * @memberof BNTest.VoxelMap
         * @param   {BNTest.GLColor}    C         color to fill with(uses adjacent colors if null).
         * @param   {boolean}           smooth    if true expansion is limited.
         * @param   {number}            chance    The chance for each voxel to be filled.
         * @return  {void}
         */
        outline: function (C, smooth, chance) {
            if (C === void 0) { C = null; }
            if (smooth === void 0) { smooth = false; }
            if (chance === void 0) { chance = 1.0; }
            var min = 1;
            var max = 1000;
            if (smooth) {
                min = 2;
            }
            var MX = System.Array.getLength(this.map, 0);
            var MY = System.Array.getLength(this.map, 1);
            var MZ = System.Array.getLength(this.map, 2);
            var N = System.Array.create(null, null, MX, MY, MZ);
            var X = 0;
            var Y = 0;
            var Z = 0;


            while (X < MX) {
                while (Y < MY) {
                    while (Z < MZ) {
                        var CT = this.map.get([X, Y, Z]);
                        if (!this.valid(CT)) {
                            var adj = this.adjacentVoxels(X, Y, Z);
                            if (adj >= min && adj <= max && (chance >= 1 || Math.random() > chance)) {
                                var col = C;
                                if (C == null) {
                                    col = this.findAdjacentVoxel(X, Y, Z);
                                }
                                CT = col;
                            }
                        }
                        N.set([X, Y, Z], CT);
                        Z = (Z + 1) | 0;
                    }
                    Z = 0;
                    Y = (Y + 1) | 0;
                }
                Y = 0;
                Z = 0;
                X = (X + 1) | 0;
            }
            this.map = N;
        },
        adjacentVoxels: function (X, Y, Z) {
            var i = 0;
            var C = this.getVoxel(((X - 1) | 0), Y, Z);
            if (this.valid(C)) {
                i = (i + 1) | 0;
            }
            C = this.getVoxel(((X + 1) | 0), Y, Z);
            if (this.valid(C)) {
                i = (i + 1) | 0;
            }
            //
            C = this.getVoxel(X, ((Y - 1) | 0), Z);
            if (this.valid(C)) {
                i = (i + 1) | 0;
            }
            C = this.getVoxel(X, ((Y + 1) | 0), Z);
            if (this.valid(C)) {
                i = (i + 1) | 0;
            }
            //
            C = this.getVoxel(X, Y, ((Z - 1) | 0));
            if (this.valid(C)) {
                i = (i + 1) | 0;
            }
            C = this.getVoxel(X, Y, ((Z + 1) | 0));
            if (this.valid(C)) {
                i = (i + 1) | 0;
            }
            return i;
        },
        findAdjacentVoxel: function (X, Y, Z) {
            var ret = null;
            var C = this.getVoxel(((X - 1) | 0), Y, Z);
            if (this.valid(C)) {
                return C;
            }
            C = this.getVoxel(((X + 1) | 0), Y, Z);
            if (this.valid(C)) {
                return C;
            }
            //
            C = this.getVoxel(X, ((Y - 1) | 0), Z);
            if (this.valid(C)) {
                return C;
            }
            C = this.getVoxel(X, ((Y + 1) | 0), Z);
            if (this.valid(C)) {
                return C;
            }
            //
            C = this.getVoxel(X, Y, ((Z - 1) | 0));
            if (this.valid(C)) {
                return C;
            }
            C = this.getVoxel(X, Y, ((Z + 1) | 0));
            if (this.valid(C)) {
                return C;
            }
            return ret;
        },
        clone: function () {
            var MX = System.Array.getLength(this.map, 0);
            var MY = System.Array.getLength(this.map, 1);
            var MZ = System.Array.getLength(this.map, 2);
            var N = System.Array.create(null, null, MX, MY, MZ);
            var X = 0;
            var Y = 0;
            var Z = 0;
            while (X < MX) {
                while (Y < MY) {
                    while (Z < MZ) {
                        N.set([X, Y, Z], this.map.get([X, Y, Z]));
                        Z = (Z + 1) | 0;
                    }
                    Z = 0;
                    Y = (Y + 1) | 0;
                }
                Y = 0;
                X = (X + 1) | 0;
            }
            var VM = new BNTest.VoxelMap();
            VM.map = N;
            return VM;
        },
        importImageLayer: function (image, z) {
            if (z === void 0) { z = 0; }
            var X = 0;
            var Y = 0;
            var i = 0;
            var P = BNTest.AnimationLoader.getPixels(image);
            var H = image.height;
            var W = image.width;

            var A = 0;
            var R = 0;
            var G = 0;
            var B = 0;
            while (Y < H) {
                while (X < W) {
                    R = P[Bridge.identity(i, (i = (i + 1) | 0))] / 255.0;
                    G = P[Bridge.identity(i, (i = (i + 1) | 0))] / 255.0;
                    B = P[Bridge.identity(i, (i = (i + 1) | 0))] / 255.0;
                    A = P[Bridge.identity(i, (i = (i + 1) | 0))] / 255.0;
                    this.map.set([X, Y, z], new BNTest.GLColor(R, G, B, A));
                    X = (X + 1) | 0;
                }
                X = 0;
                Y = (Y + 1) | 0;
            }
        },
        valid: function (C) {
            return C != null && C.a > 0;
        },
        opaque: function (C) {
            if (!BNTest.GLDemo.allowAlpha) {
                return this.valid(C);
            }
            return C != null && C.a >= 1;
        },
        getInvisibleSides: function (X, Y, Z) {
            var ret = System.Array.init(6, false);
            ret[0] = this.opaque(this.getVoxel(X, Y, ((Z - 1) | 0)));
            ret[1] = this.opaque(this.getVoxel(X, Y, ((Z + 1) | 0)));
            ret[2] = this.opaque(this.getVoxel(((X - 1) | 0), Y, Z));
            ret[3] = this.opaque(this.getVoxel(((X + 1) | 0), Y, Z));
            ret[4] = this.opaque(this.getVoxel(X, ((Y - 1) | 0), Z));
            ret[5] = this.opaque(this.getVoxel(X, ((Y + 1) | 0), Z));

            return ret;
        },
        applyPalette: function (palette) {
            var Keys = System.Linq.Enumerable.from(palette.getKeys()).toList(BNTest.GLColor);
            var Vals = System.Linq.Enumerable.from(palette.getValues()).toList(BNTest.GLColor);
            if (Keys.getCount() <= 0) {
                return;
            }

            var X = 0;
            var Y = 0;
            var Z = 0;
            var MX = System.Array.getLength(this.map, 0);
            var MY = System.Array.getLength(this.map, 1);
            var MZ = System.Array.getLength(this.map, 2);
            var key = null;
            var i = 0;
            var ln = Keys.getCount();
            while (X < MX) {
                while (Y < MY) {
                    while (Z < MZ) {
                        var C = this.map.get([X, Y, Z]);
                        if (C != null && C.a > 0) {

                            //var ind = Keys.IndexOf(C);
                            key = null;
                            i = 0;
                            while (i < ln) {
                                var t = Keys.getItem(i);
                                if (t.similar(C)) {
                                    key = t;
                                    i = ln;
                                }
                                i = (i + 1) | 0;
                            }
                            //GLColor key = (Keys.First(C2 => C2.Equals(C) ));

                            if (key != null) {
                                var ind = Keys.indexOf(key);
                                if (ind >= 0) {
                                    this.map.set([X, Y, Z], Vals.getItem(ind));
                                }
                            }
                        }
                        Z = (Z + 1) | 0;
                    }
                    Z = 0;
                    Y = (Y + 1) | 0;
                }
                Y = 0;
                Z = 0;
                X = (X + 1) | 0;
            }
        },
        swapYZ: function () {
            var N = System.Array.create(null, null, System.Array.getLength(this.map, 0), System.Array.getLength(this.map, 2), System.Array.getLength(this.map, 1));
            var X = 0;
            var Y = 0;
            var Z = 0;
            while (X < System.Array.getLength(this.map, 0)) {
                while (Y < System.Array.getLength(this.map, 1)) {
                    while (Z < System.Array.getLength(this.map, 2)) {
                        N.set([X, Z, Y], this.map.get([X, Y, Z]));
                        Z = (Z + 1) | 0;
                    }
                    Z = 0;
                    Y = (Y + 1) | 0;
                }
                Y = 0;
                X = (X + 1) | 0;
            }
            this.map = N;
        },
        getPalette: function () {
            var ret = new (System.Collections.Generic.List$1(BNTest.GLColor))();
            var X = 0;
            var Y = 0;
            var Z = 0;
            while (X < System.Array.getLength(this.map, 0)) {
                while (Y < System.Array.getLength(this.map, 1)) {
                    while (Z < System.Array.getLength(this.map, 2)) {
                        var C = this.map.get([X, Y, Z]);
                        if (C != null) {
                            if (!ret.contains(C)) {
                                ret.add(C);
                            }
                        }
                        Z = (Z + 1) | 0;
                    }
                    Z = 0;
                    Y = (Y + 1) | 0;
                }
                Y = 0;
                Z = 0;
                X = (X + 1) | 0;
            }
            return ret.toArray();
        },
        resize: function (NewDimensions) {
            var NX = NewDimensions[0];
            var NY = NewDimensions[1];
            var NZ = NewDimensions[2];
            var MX = System.Array.getLength(this.map, 0);
            var MY = System.Array.getLength(this.map, 1);
            var MZ = System.Array.getLength(this.map, 2);
            if (MX < NX || MY < NY || MZ < NZ) {
                //TO DO:Resize logic.
                var NM = System.Array.create(null, null, NX, NY, NZ);
                var XOffset = (((NX - MX) | 0)) >> 1;
                var YOffset = (((NY - MY) | 0)) >> 1;
                var ZOffset = (((NZ - MZ) | 0)) >> 1;
                var X = 0;
                var Y = 0;
                var Z = 0;

                while (X < NX) {
                    while (Y < NY) {
                        while (Z < NZ) {
                            var OV = this.getVoxel(((X - XOffset) | 0), ((Y - YOffset) | 0), ((Z - ZOffset) | 0));
                            NM.set([X, Y, Z], OV);
                            Z = (Z + 1) | 0;
                        }
                        Z = 0;
                        Y = (Y + 1) | 0;
                    }
                    Y = 0;
                    Z = 0;
                    X = (X + 1) | 0;
                }
                this.map = NM;

                return true;
            }
            return false;
        },
        fill: function (box, C) {
            var sz = box.getSize();
            this.fill$1(Bridge.Int.clip32(box.min.x), Bridge.Int.clip32(box.min.y), Bridge.Int.clip32(box.min.z), Bridge.Int.clip32(sz.x), Bridge.Int.clip32(sz.y), Bridge.Int.clip32(sz.z), C);
        },
        fill$1: function (X, Y, Z, Width, Height, Depth, C) {
            var SX = X;
            var SY = Y;
            var SZ = Z;
            var X2 = (SX + Width) | 0;
            var Y2 = (SY + Height) | 0;
            var Z2 = (SZ + Depth) | 0;
            while (X < X2) {
                while (Y < Y2) {
                    while (Z < Z2) {
                        this.setVoxel$1(X, Y, Z, C);
                        Z = (Z + 1) | 0;
                    }
                    Z = SZ;
                    Y = (Y + 1) | 0;
                }
                Y = SY;
                X = (X + 1) | 0;
            }
        },
        setVoxel: function (V, C) {
            return this.setVoxel$1(Bridge.Int.clip32(V.x), Bridge.Int.clip32(V.y), Bridge.Int.clip32(V.z), C);
        },
        setVoxel$1: function (X, Y, Z, C) {
            if (X >= 0 && Y >= 0 && Z >= 0 && X < System.Array.getLength(this.map, 0) && Y < System.Array.getLength(this.map, 1) && Z < System.Array.getLength(this.map, 2)) {
                if (!Bridge.referenceEquals(this.map.get([X, Y, Z]), C)) {
                    this.map.set([X, Y, Z], C);
                    return true;
                }
            }
            return false;
        },
        combine: function (VM, XOffset, YOffset, ZOffset) {
            if (XOffset === void 0) { XOffset = 0; }
            if (YOffset === void 0) { YOffset = 0; }
            if (ZOffset === void 0) { ZOffset = 0; }
            if (!BNTest.VoxelMap.sameSize(this, VM)) {
                var ND = BNTest.VoxelMap.getMaxSize(this, VM);
                this.resize(ND);
                VM.resize(ND);
            }

            var X = 0;
            var Y = 0;
            var Z = 0;
            var MX = System.Array.getLength(this.map, 0);
            var MY = System.Array.getLength(this.map, 1);
            var MZ = System.Array.getLength(this.map, 2);

            while (X < MX) {
                while (Y < MY) {
                    while (Z < MZ) {
                        /* var OV = Map[X, Y, Z];
                            var V = VM.Map[X, Y, Z];
                            if (OV == null || (V != null && V.A >= OV.A))
                            {
                                Map[X, Y, Z] = V;
                            }*/
                        var OV = this.getVoxel(((X + XOffset) | 0), ((Y + XOffset) | 0), ((Z + ZOffset) | 0));
                        //var V = VM.Map[X, Y, Z];
                        var V = VM.getVoxel(X, Y, Z);
                        if (OV == null || (V != null && V.a >= OV.a)) {
                            this.setVoxel$1(((X + XOffset) | 0), ((Y + XOffset) | 0), ((Z + ZOffset) | 0), V);
                        }
                        Z = (Z + 1) | 0;
                    }
                    Z = 0;
                    Y = (Y + 1) | 0;
                }
                Y = 0;
                Z = 0;
                X = (X + 1) | 0;
            }
        },
        getValidQuadrants: function (X, Y, Z) {
            var ret = System.Array.init(8, false);
            ret[0] = this.isValidQuadrants(X, Y, Z, false, false, false);
            ret[1] = this.isValidQuadrants(X, Y, Z, true, false, false);
            ret[2] = this.isValidQuadrants(X, Y, Z, false, true, false);
            ret[3] = this.isValidQuadrants(X, Y, Z, true, true, false);

            ret[4] = this.isValidQuadrants(X, Y, Z, false, false, true);
            ret[5] = this.isValidQuadrants(X, Y, Z, true, false, true);
            ret[6] = this.isValidQuadrants(X, Y, Z, false, true, true);
            ret[7] = this.isValidQuadrants(X, Y, Z, true, true, true);

            if (!System.Array.contains(ret, true, Boolean)) {
                //if the voxel is completely isolated, make it a full cube.
                ret = [true, true, true, true, true, true, true, true];
            }
            return ret;
        },
        isValidQuadrants: function (X, Y, Z, sx, sy, sz) {
            var TX = (X - 1) | 0;
            if (sx) {
                TX = (TX + 1) | 0;
            }
            var TY = (Y - 1) | 0;
            if (sy) {
                TY = (TY + 1) | 0;
            }
            var TZ = (Z - 1) | 0;
            if (sz) {
                TZ = (TZ + 1) | 0;
            }
            var ret = false;
            var XX = 0;
            var YY = 0;
            var ZZ = 0;
            while (XX < 2) {
                while (YY < 2) {
                    while (ZZ < 2) {
                        var FX = (TX + XX) | 0;
                        var FY = (TY + YY) | 0;
                        var FZ = (TZ + ZZ) | 0;
                        if (!(FX === X && FY === Y && FZ === Z)) {
                            if (this.valid(this.getVoxel(FX, FY, FZ))) {
                                return true;
                            }
                        }
                        ZZ = (ZZ + 1) | 0;
                    }
                    ZZ = 0;
                    YY = (YY + 1) | 0;
                }
                YY = 0;
                XX = (XX + 1) | 0;
            }
            return ret;
        }
    });

    Bridge.define("BNTest.WGMatrix", {
        statics: {
            tmatrix: null,
            tbmatrix: null,
            t2matrix: null,
            tmatobj: null,
            init: function () {
                if (BNTest.WGMatrix.tmatrix == null) {
                    var c = System.Array.init(4, null);
                    c[0] = System.Array.init(4, 0);
                    c[1] = System.Array.init(4, 0);
                    c[2] = System.Array.init(4, 0);
                    c[3] = System.Array.init(4, 0);
                    BNTest.WGMatrix.tmatrix = c;
                    c = System.Array.init(4, null);
                    c[0] = System.Array.init(4, 0);
                    c[1] = System.Array.init(4, 0);
                    c[2] = System.Array.init(4, 0);
                    c[3] = System.Array.init(4, 0);
                    BNTest.WGMatrix.tbmatrix = c;

                    c = System.Array.init(4, null);
                    c[0] = System.Array.init(4, 0);
                    c[1] = System.Array.init(4, 0);
                    c[2] = System.Array.init(4, 0);
                    c[3] = System.Array.init(4, 0);
                    var m = {};
                    m.elements = c;
                    BNTest.WGMatrix.tmatobj = m;
                    BNTest.WGMatrix.t2matrix = c;
                }
            },
            flatten: function (matrix) {
                var M = matrix.elements;
                return [M[0][0], M[1][0], M[2][0], M[3][0], M[0][1], M[1][1], M[2][1], M[3][1], M[0][2], M[1][2], M[2][2], M[3][2], M[0][3], M[1][3], M[2][3], M[3][3]];
            },
            flattenB: function (matrix) {
                var M = matrix.elements;
                return [M[0][0], M[0][1], M[0][2], M[0][3], M[1][0], M[1][1], M[1][2], M[1][3], M[2][0], M[2][1], M[2][2], M[2][3], M[3][0], M[3][1], M[3][2], M[3][3]];
            },
            copyFrom: function (source, destination) {
                var a = source.elements;
                var b = destination.elements;
                var t = b[0];
                var t2 = a[0];
                t[0] = t2[0];
                t[1] = t2[1];
                t[2] = t2[2];
                t[3] = t2[3];

                t = b[1];
                t2 = a[1];
                t[0] = t2[0];
                t[1] = t2[1];
                t[2] = t2[2];
                t[3] = t2[3];

                t = b[2];
                t2 = a[2];
                t[0] = t2[0];
                t[1] = t2[1];
                t[2] = t2[2];
                t[3] = t2[3];

                t = b[3];
                t2 = a[3];
                t[0] = t2[0];
                t[1] = t2[1];
                t[2] = t2[2];
                t[3] = t2[3];
            },
            copyFromInverted: function (source, destination) {
                var a = source;
                var b = destination;
                var t = b[0];
                t[0] = a[0][0];
                t[1] = a[1][0];
                t[2] = a[2][0];
                t[3] = a[3][0];

                t = b[1];
                t[0] = a[0][1];
                t[1] = a[1][1];
                t[2] = a[2][1];
                t[3] = a[3][1];

                t = b[2];
                t[0] = a[0][2];
                t[1] = a[1][2];
                t[2] = a[2][2];
                t[3] = a[3][2];

                t = b[3];
                t[0] = a[0][3];
                t[1] = a[1][3];
                t[2] = a[2][3];
                t[3] = a[3][3];
            },
            multMatrix: function (matrix1, matrix2) {
                var a = matrix1.elements;
                BNTest.WGMatrix.copyFromInverted(matrix2.elements, BNTest.WGMatrix.tbmatrix);
                var b = BNTest.WGMatrix.tbmatrix;
                var c = BNTest.WGMatrix.tmatrix;
                //var l = 4;
                var l = 3;
                //double cij = 0;
                var ci;
                var ai;
                var bj;
                for (var i = 0; i < l; i = (i + 1) | 0) {
                    ci = c[i];
                    ai = a[i];
                    //bi = b[i];
                    var ai0 = ai[0];
                    var ai1 = ai[1];
                    var ai2 = ai[2];
                    var ai3 = ai[3];
                    for (var j = 0; j < 4; j = (j + 1) | 0) {
                        bj = b[j];
                        //ci[j] = ai0 * b[0][j] + ai1 * b[1][j] + ai2 * b[2][j] + ai3 * b[3][j];
                        ci[j] = ai0 * bj[0] + ai1 * bj[1] + ai2 * bj[2] + ai3 * bj[3];
                    }
                }
                matrix1.elements = c;
                BNTest.WGMatrix.tmatrix = a;
            },
            oldMultMatrix: function (matrix1, matrix2) {
                var a = matrix1.elements;
                var b = matrix2.elements;
                var c = BNTest.WGMatrix.tmatrix;
                //var l = 4;
                var l = 3;
                //double cij = 0;
                var ci;
                var ai;
                for (var i = 0; i < l; i = (i + 1) | 0) {
                    ci = c[i];
                    ai = a[i];
                    var ai0 = ai[0];
                    var ai1 = ai[1];
                    var ai2 = ai[2];
                    var ai3 = ai[3];
                    for (var j = 0; j < 4; j = (j + 1) | 0) {
                        /* c[i][j] = 0;
                        for (int k = 0; k < 4; k++) // OR k<b.GetLength(0)
                            c[i][j] += a[i][k] * b[k][j];*/
                        /* cij = 0;
                        for (int k = 0; k < 4; k++)
                            cij += ai[k] * b[k][j];
                        ci[j] = cij;*/
                        ci[j] = ai0 * b[0][j] + ai1 * b[1][j] + ai2 * b[2][j] + ai3 * b[3][j];

                    }
                }
                matrix1.elements = c;
                BNTest.WGMatrix.tmatrix = a;
            },
            clear: function (matrix) {
                var $t, $t1, $t2, $t3, $t4, $t5, $t6, $t7, $t8, $t9, $t10, $t11;
                var D = matrix;
                D[0][1] = ($t = ($t1 = ($t2 = ($t3 = ($t4 = ($t5 = ($t6 = ($t7 = ($t8 = ($t9 = (D[3][2] = 0, 0), D[3][1] = $t9, $t9), D[3][0] = $t8, $t8), D[2][3] = $t7, $t7), D[2][1] = $t6, $t6), D[2][0] = $t5, $t5), D[1][3] = $t4, $t4), D[1][2] = $t3, $t3), D[1][0] = $t2, $t2), D[0][3] = $t1, $t1), D[0][2] = $t, $t);
                D[0][0] = ($t10 = ($t11 = (D[3][3] = 1, 1), D[2][2] = $t11, $t11), D[1][1] = $t10, $t10);

            }
        },
        mvMatrix: null,
        identity: true,
        mvMatrixStack: null,
        config: {
            init: function () {
                this.mvMatrixStack = System.Array.init(0, null);
            }
        },
        ctor: function () {
            this.$initialize();
            this.mvMatrix = Matrix.I(4);
        },
        loadIdentity: function () {
            //this.mvMatrix = Script.Write<object>("Matrix.I(4);");
            this.clear();
        },
        newIdentity: function () {
            var c = System.Array.init(4, null);
            c[0] = System.Array.init(4, 0);
            c[1] = System.Array.init(4, 0);
            c[2] = System.Array.init(4, 0);
            c[3] = System.Array.init(4, 0);
            this.mvMatrix.elements = c;
            this.clear();
        },
        isIdentity: function () {
            var M = this.mvMatrix.elements;
            return M[0][0] === 1 && M[1][1] === 1 && M[2][2] === 1 && M[0][1] === 0 && M[0][2] === 0 && M[0][3] === 0 && M[1][0] === 0 && M[1][2] === 0 && M[1][3] === 0 && M[2][0] === 0 && M[2][1] === 0 && M[2][3] === 0 && M[3][0] === 0 && M[3][1] === 0 && M[3][2] === 0;
        },
        getMatrix: function () {
            //double[][] a = mvMatrix["elements"].As<double[][]>();
            var M = this.mvMatrix.elements;
            var b = System.Array.init(4, null);
            b[0] = [M[0][0], M[0][1], M[0][2], M[0][3]];
            b[1] = [M[1][0], M[1][1], M[1][2], M[1][3]];
            b[2] = [M[2][0], M[2][1], M[2][2], M[2][3]];
            b[3] = [M[3][0], M[3][1], M[3][2], M[3][3]];
            /* b[0] = new double[0];
                b[1] = new double[0];
                b[2] = new double[0];
                b[3] = new double[0];
                b[0][0] = a[0][0];
                b[0][1] = a[0][1];
                b[0][2] = a[0][2];
                b[0][3] = a[0][3];

                b[1][0] = a[1][0];
                b[1][1] = a[1][1];
                b[1][2] = a[1][2];
                b[1][3] = a[1][3];

                b[2][0] = a[2][0];
                b[2][1] = a[2][1];
                b[2][2] = a[2][2];
                b[2][3] = a[2][3];

                b[3][0] = a[3][0];
                b[3][1] = a[3][1];
                b[3][2] = a[3][2];
                b[3][3] = a[3][3];*/
            return b;
        },
        multiplyMatrix: function (matrix) {

            if (this.identity && !matrix.identity) {
                this.copyFrom(matrix);
                this.identity = false;
                return;
            } else if (!this.identity && matrix.identity) {
                return;
            }
            //MultiplyMatrix(matrix.mvMatrix);
            BNTest.WGMatrix.multMatrix(this.mvMatrix, matrix.mvMatrix);

            this.identity = this.isIdentity();
        },
        multiplyMatrix$1: function (matrix) {
            if (this.identity) {
                this.copyFrom$1(matrix);
            } else {
                BNTest.WGMatrix.multMatrix(this.mvMatrix, matrix);
            }

            this.identity = this.isIdentity();
        },
        copyFrom: function (source) {
            BNTest.WGMatrix.copyFrom(source.mvMatrix, this.mvMatrix);
        },
        copyFrom$1: function (source) {
            BNTest.WGMatrix.copyFrom(source, this.mvMatrix);
        },
        mvTranslate: function (v) {
            /* var m = Script.Write<object>("Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4()");
                MultiplyMatrix(m);*/

            /* var m = Script.Write<object>("{}");
                double[][] D = new double[0][];

                D[0] = new double[] { 1, 0, 0, v[0] };
                D[1] = new double[] { 0, 1, 0, v[1] };
                D[2] = new double[] { 0, 0, 1, v[2] };
                D[3] = new double[] { 0, 0, 0, 1 };
                m["elements"] = D;*/
            var D = BNTest.WGMatrix.t2matrix;
            BNTest.WGMatrix.clear(BNTest.WGMatrix.t2matrix);
            BNTest.WGMatrix.t2matrix[0][3] = v[0];
            BNTest.WGMatrix.t2matrix[1][3] = v[1];
            BNTest.WGMatrix.t2matrix[2][3] = v[2];

            this.multiplyMatrix$1(BNTest.WGMatrix.tmatobj);

            this.identity = this.isIdentity();
            //Script.Write("this.multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());");
        },
        mvPushMatrix: function () {
            /* if (m != null)
                {
                    Script.Write("this.mvMatrixStack.push(m.dup())");
                    Script.Write("this.mvMatrix = m.dup()");
                }
                else
                {
                    Script.Write("this.mvMatrixStack.push(this.mvMatrix.dup())");
                }*/
            /* object m = null;
                if (m == null)
                {
                    m = GetMatrix();
                }
                else
                {
                    mvMatrix["elements"] = m;
                    identity = IsIdentity();
                }
                mvMatrixStack.Push(m);*/
            this.mvMatrixStack.push(this.getMatrix());
            //mvMatrix["elements"] = GetMatrix();
            //mvMatrixStack.Add(m);
            //identity = IsIdentity();
        },
        mvPopMatrix: function () {
            /* if (!Script.Write<bool>("this.mvMatrixStack.length"))
                {
                    Script.Write("throw (\"Can't pop from an empty matrix stack.\")");
                }

                mvMatrix = Script.Write<object>("this.mvMatrixStack.pop()");*/
            //mvMatrix = Script.Write<object>("mvMatrixStack.pop()");
            //mvMatrix["elements"]
            var D = this.mvMatrixStack.pop();
            this.mvMatrix.elements = D;
            return this.mvMatrix;
        },
        equals: function (o) {
            if (Bridge.is(o, BNTest.WGMatrix)) {
                var D = this.mvMatrix;
                var D2 = o.mvMatrix;
                var i = 0;
                while (i < 16) {
                    if (D[i] !== D2[i]) {
                        return false;
                    }
                    i = (i + 1) | 0;
                }
                return true;
            }
            return Bridge.equals(this, o);
        },
        clear: function () {
            /* double[] D = mvMatrix.As<double[]>();
                var i = 0;
                while (i < 16)
                {
                    D[i] = 0;
                    i++;
                }
                D[0] = D[5] = D[10] = D[15] = 1;*/
            var D = this.mvMatrix.elements;

            D[0] = [1, 0, 0, 0];
            D[1] = [0, 1, 0, 0];
            D[2] = [0, 0, 1, 0];
            D[3] = [0, 0, 0, 1];

            this.identity = true;
            /* Script.Write("me[0][0]=s.x");
                Script.Write("me[1][1]=s.y");
                Script.Write("me[2][2]=s.z");*/
        },
        setTranslation: function (V) {
            /* double[] D = mvMatrix.As<double[]>();
                D[12] = V.X;
                D[13] = V.Y;
                D[14] = V.Z;*/
            var D = this.mvMatrix.elements;
            D[0][3] = V.x;
            D[1][3] = V.y;
            D[2][3] = V.z;
        },
        setPositionThenScale: function (Position, Scale) {
            var D = this.mvMatrix.elements;
            D[0][0] = Scale.x;
            D[1][1] = Scale.y;
            D[2][2] = Scale.z;

            D[0][3] = Position.x;
            D[1][3] = Position.y;
            D[2][3] = Position.z;

            this.identity = this.isIdentity();
        },
        setScale: function (S) {
            var D = this.mvMatrix.elements;
            D[0][0] = S.x;
            D[1][1] = S.y;
            D[2][2] = S.z;
        },
        getTranslation: function () {
            var D = this.mvMatrix;
            return new BNTest.GLVec3.ctor(D[12], D[13], D[14]);
        },
        clone: function () {
            var ret = new BNTest.WGMatrix();
            //ret.MultiplyMatrix(this);
            ret.copyFrom(this);

            //ret.multMatrix(this);
            return ret;
        },
        mvScale: function (Scale) {
            var s = Scale;
            //var m = Script.Write<object>("Matrix.I(4);");
            /* var m = Script.Write<object>("{}");
                double[][] D = new double[0][];

                D[0] = new double[] { 1, 0, 0, 0 };
                D[1] = new double[] { 0, 1, 0, 0 };
                D[2] = new double[] { 0, 0, 1, 0 };
                D[3] = new double[] { 0, 0, 0, 1 };
                m["elements"] = D;
                var me = Script.Write<object>("m.elements");*/
            var m = BNTest.WGMatrix.tmatobj;
            BNTest.WGMatrix.clear(BNTest.WGMatrix.t2matrix);
            BNTest.WGMatrix.t2matrix[0][0] = s.x;
            BNTest.WGMatrix.t2matrix[1][1] = s.y;
            BNTest.WGMatrix.t2matrix[2][2] = s.z;
            /* Script.Write("me[0][0]=s.x");
                Script.Write("me[1][1]=s.y");
                Script.Write("me[2][2]=s.z");*/
            //multMatrix(m);
            this.multiplyMatrix$1(m);
        },
        mvRotate: function (angle, Direction) {
            this.mvRotate$1(angle, [Direction.x, Direction.y, Direction.z]);
        },
        mvRotate$1: function (angle, v) {
            //var inRadians = angle * Math.PI / 180.0;
            var inRadians = angle * 0.01745329251;

            var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
            //multMatrix(m);
            this.multiplyMatrix$1(m);
        },
        rotateX: function (radians) {
            /* var m = Script.Write<object>("{}");
                double[][] D = new double[0][];

                D[0] = new double[] { 1, 0, 0, 0 };
                D[1] = new double[] { 0, 1, 0, 0 };
                D[2] = new double[] { 0, 0, 1, 0 };
                D[3] = new double[] { 0, 0, 0, 1 };*/
            var D = BNTest.WGMatrix.t2matrix;
            BNTest.WGMatrix.clear(BNTest.WGMatrix.t2matrix);


            var C = Math.cos(radians);
            var S = Math.sin(radians);

            D[1][1] = C;
            D[1][2] = S;
            D[2][1] = -(S);
            D[2][2] = C;

            //m["elements"] = D;

            //MultiplyMatrix(m);
            this.multiplyMatrix$1(BNTest.WGMatrix.tmatobj);
        },
        rotateY: function (radians) {
            /* var m = Script.Write<object>("{}");
                double[][] D = new double[0][];

                D[0] = new double[] { 1, 0, 0, 0 };
                D[1] = new double[] { 0, 1, 0, 0 };
                D[2] = new double[] { 0, 0, 1, 0 };
                D[3] = new double[] { 0, 0, 0, 1 };*/
            var D = BNTest.WGMatrix.t2matrix;
            BNTest.WGMatrix.clear(BNTest.WGMatrix.t2matrix);


            var C = Math.cos(radians);
            var S = Math.sin(radians);

            D[0][0] = C;
            D[0][2] = -(S);
            D[2][0] = S;
            D[2][2] = C;

            //m["elements"] = D;

            //MultiplyMatrix(m);
            this.multiplyMatrix$1(BNTest.WGMatrix.tmatobj);
        },
        rotateZ: function (radians) {
            /* var m = Script.Write<object>("{}");
                double[][] D = new double[0][];

                D[0] = new double[] { 1, 0, 0, 0 };
                D[1] = new double[] { 0, 1, 0, 0 };
                D[2] = new double[] { 0, 0, 1, 0 };
                D[3] = new double[] { 0, 0, 0, 1 };*/
            var D = BNTest.WGMatrix.t2matrix;
            BNTest.WGMatrix.clear(BNTest.WGMatrix.t2matrix);


            var C = Math.cos(radians);
            var S = Math.sin(radians);

            D[0][0] = C;
            D[0][1] = S;
            D[1][0] = -(S);
            D[1][1] = C;

            //m["elements"] = D;

            //MultiplyMatrix(m);
            this.multiplyMatrix$1(BNTest.WGMatrix.tmatobj);
        }
    });

    Bridge.define("BNTest.World", {
        statics: {
            viewDistance: 100,
            blank: null,
            config: {
                init: function () {
                    this.blank = new (System.Collections.Generic.List$1(BNTest.Entity))();
                }
            }
        },
        model: null,
        game: null,
        entities: null,
        octree: null,
        cam: null,
        config: {
            init: function () {
                this.cam = new BNTest.GLVec3.ctor();
            }
        },
        ctor: function (Game) {
            this.$initialize();
            this.game = Game;
            this.model = new BNTest.Model(Game);
            this.entities = new (System.Collections.Generic.List$1(BNTest.Entity))();

            this.octree = new BNTest.Octree(50, 4);
        },
        getOffset: function () {
            return this.model.offset;
        },
        setOffset: function (value) {
            this.model.offset = value;
        },
        add: function (E) {
            if (!Bridge.referenceEquals(E.world, this) && E.world != null) {
                E.world.remove(E);
            }
            if (!this.entities.contains(E)) {
                this.entities.add(E);
            }
            if (E.model != null) {
                this.add$1(E.model);
            }
            E.world = this;
        },
        add$1: function (M) {
            if (M != null && !this.model.children.contains(M)) {
                this.model.children.add(M);
            }
        },
        remove: function (E) {
            if (this.entities.contains(E)) {
                this.entities.remove(E);
            }
            if (E.model != null) {
                this.remove$1(E.model);
            }
            E.world = null;
        },
        remove$1: function (M) {
            if (M != null && this.model.children.contains(M)) {
                M.unloadBuffers();
                this.model.children.remove(M);
            }
        },
        bringToFront: function (M) {
            //Remove(M);
            if (this.model.children.contains(M)) {
                this.model.children.remove(M);
                this.model.children.add(M);
            }
        },
        sendToBack: function (M) {
            //Remove(M);
            if (this.model.children.contains(M)) {
                this.model.children.remove(M);
                this.model.children.insert(0, M);
            }
        },
        update: function () {
            BNTest.World.viewDistance = this.game.cameraDist * 4;
            //octree.Update(Entities);
            //Cam = Offset * -1;
            this.cam = BNTest.GLVec3.op_UnaryNegation(this.getOffset());
            var i = 0;
            while (i < this.entities.getCount()) {
                var E = this.entities.getItem(i);
                E.update();
                if (!E.alive) {
                    //entities.RemoveAt(i);
                    this.remove(E);
                    i = (i - 1) | 0;
                }
                i = (i + 1) | 0;
            }
            this.updateCollisions();
        },
        findObstructionCollision: function (box, exclusion) {
            if (exclusion === void 0) { exclusion = null; }
            var none = true;
            var ret = [];
            var Ent = this.entities.items;
            var i = 0;
            var ln = Ent.length;
            while (i < ln) {
                var E = Ent[i];
                if ((E.solid || E.obstruction) && E != exclusion && E.lastBB != null && !E.lastBB.getEmpty() && E.lastBB.intersection$2(box)) {
                    ret.push(E);
                }
                i = (i + 1) | 0;
            }
            return ret;
        },
        findObstructionCollision$1: function (Position, exclusion) {
            if (exclusion === void 0) { exclusion = null; }
            //return Entities.Where(E => E.Solid && E != exclusion && E.LastBB != null && E.LastBB.Size.RoughLength>0 && E.LastBB.Contains(Position)).ToList();
            var none = true;
            var ret = [];
            var Ent = this.entities.items;
            var i = 0;
            var ln = Ent.length;
            while (i < ln) {
                var E = Ent[i];
                if ((E.solid || E.obstruction) && E != exclusion && E.lastBB != null && !E.lastBB.getEmpty() && E.lastBB.contains(Position)) {
                    ret.push(E);
                }
                i = (i + 1) | 0;
            }
            return ret;
        },
        findSolidCollision: function (box, exclusion) {
            if (exclusion === void 0) { exclusion = null; }
            var none = true;
            var ret = [];
            var Ent = this.entities.items;
            var i = 0;
            var ln = Ent.length;
            while (i < ln) {
                var E = Ent[i];
                if (E.solid && E != exclusion && E.lastBB != null && !E.lastBB.getEmpty() && E.lastBB.intersection$2(box)) {
                    ret.push(E);
                }
                i = (i + 1) | 0;
            }
            return ret;
        },
        findSolidCollision$2: function (Position, exclusion) {
            if (exclusion === void 0) { exclusion = null; }
            //return Entities.Where(E => E.Solid && E != exclusion && E.LastBB != null && E.LastBB.Size.RoughLength>0 && E.LastBB.Contains(Position)).ToList();
            var none = true;
            var ret = [];
            var Ent = this.entities.items;
            var i = 0;
            var ln = Ent.length;
            while (i < ln) {
                var E = Ent[i];
                if (E.solid && E != exclusion && E.lastBB != null && !E.lastBB.getEmpty() && E.lastBB.contains(Position)) {
                    ret.push(E);
                }
                i = (i + 1) | 0;
            }
            return ret;
        },
        findSolidCollision$1: function (entity) {
            if (entity.lastBB == null) {
                return [];
            }
            return this.findSolidCollision(entity.lastBB);
        },
        updateCollisions: function () {
            this.updateAttackCollisions();
        },
        updateAttackCollisions: function () {
            //List<Entity> LC = entities.(E => E is IHarmfulEntity);
            /* List<IHarmfulEntity> LHE = Entities.OfType<IHarmfulEntity>().ToList();
                List<ICombatant> LC = Entities.OfType<ICombatant>().ToList();*/
            var i = 0;
            var LHE = System.Array.init(0, null);
            var LC = System.Array.init(0, null);
            var ln = this.entities.getCount();
            while (i < ln) {
                var E = this.entities.getItem(i);
                //if (E.As<ICombatant>().TargetPriority.As<bool>())
                if (E.getTargetPriority) {
                    LC.push(E);
                }
                //if (E.As<IHarmfulEntity>().touchDamage.As<bool>())
                if (E.gettouchDamage) {
                    LHE.push(E);
                }
                i = (i + 1) | 0;
            }

            i = 0;
            var li = LHE.length;
            var jli = LC.length;
            while (i < li) {
                var ji = 0;
                var HE = LHE[i];
                var THE = HE;
                var B = THE.lastBB;
                while (ji < jli) {
                    var C = LC[ji];
                    {
                        if (!HE.BNTest$IHarmfulEntity$getAttacker().sameTeam(C)) {
                            var CE = C;
                            var CB = CE.lastBB;
                            //var CB = CE.GetHitbox();
                            if (B.intersection$2(CB) && HE.BNTest$IHarmfulEntity$ontouchDamage(C)) {
                                this.game.attack(C, HE);
                            }
                        }
                    }
                    ji = (ji + 1) | 0;
                }
                i = (i + 1) | 0;
            }
            /* LHE.ForEach(HE => LC.ForEach(C =>
                {
                    Entity THE = (Entity)HE;
                    //var B = THE.GetBoundingBox();
                    var B = THE.LastBB;
                    if (!HE.Attacker.SameTeam((Entity)C))
                    {
                        Entity CE = (Entity)C;
                        //var CB = CE.GetBoundingBox();
                        var CB = CE.LastBB;
                        if (B.Intersection(CB))
                        {
                            Game.Attack(C, HE);
                        }
                    }
                }));*/
        }
    });

    Bridge.define("BNTest.AimedWandering", {
        inherits: [BNTest.EntityBehavior],
        target: null,
        target2: null,
        focus: 0.95,
        range: 120,
        ctor: function (entity) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);

        },
        update: function () {
            var N = this.entity.getBehavior(BNTest.NavigatorAI);
            if (N == null) {
                N = new BNTest.NavigatorAI(this.entity);
                N.framesPerTick = (Bridge.Int.div(this.framesPerTick, 3)) | 0;
                this.entity.addBehavior(N);
            }
            //if (N.MoveTo == null)
            {
                var T = this.target2;
                if (T == null && this.target != null && this.target.getPosition() != null) {
                    //T = Target.Position.Clone();
                    T = this.target.getPosition();
                }
                if (T == null) {
                    return;
                }
                var relative = BNTest.GLVec3.op_Subtraction(this.entity.getPosition(), T);
                var dist = relative.getRoughLength();
                var maxrange = this.range;
                var mr2 = maxrange + maxrange;
                //GLVec3 V = new GLVec3(Math.Random()*maxrange, Math.Random() * maxrange, Math.Random() * maxrange) + entity.Position;
                var ok = false;
                while (!ok) {
                    var V = BNTest.GLVec3.op_Addition(new BNTest.GLVec3.ctor(-maxrange + (Math.random() * mr2), 0, -maxrange + (Math.random() * mr2)), this.entity.getPosition());
                    var Nrelative = BNTest.GLVec3.op_Subtraction(V, T);
                    if (Nrelative.getRoughLength() < dist || Math.random() > this.focus) {
                        N.requestMoveTo(V, 0.42, true);
                        ok = true;
                    }
                }
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        }
    });

    Bridge.define("BNTest.Barrier", {
        inherits: [BNTest.Entity],
        ctor: function (world, size) {
            this.$initialize();
            BNTest.Entity.ctor.call(this, world);
            this.game = world.game;
            this.model = new BNTest.Model(this.game);
            this.solid = true;

            var M = new BNTest.Mesh(this.game);
            M.addCube2(new BNTest.GLVec3.ctor(), size, new BNTest.GLColor(0, 0, 0, 0.3), null);

            this.model.meshes.add(M);
            this.cacheBoundingBox();
        },
        update: function () {
            BNTest.Entity.prototype.update.call(this);
            this.world.bringToFront(this.model);
        },
        draw: function (gl) {
            BNTest.Entity.prototype.draw.call(this, gl);
        }
    });

    Bridge.define("BNTest.BasicSword", {
        inherits: [BNTest.EntityBehavior,BNTest.IWeaponBehavior],
        _ammo: 0,
        _maxAmmo: 3,
        _shotDelay: 0,
        _maxShotDelay: 2,
        _angle: 0,
        bulletSpeed: 0,
        bulletGraphic: null,
        active: false,
        speed: null,
        forcedAngle: 0,
        minCoolDown: 18,
        config: {
            alias: [
            "getEnergyCost", "BNTest$IWeaponBehavior$getEnergyCost",
            "getMaxCooldown", "BNTest$IWeaponBehavior$getMaxCooldown",
            "setFiringAngle", "BNTest$IWeaponBehavior$setFiringAngle",
            "getWeaponType", "BNTest$IWeaponBehavior$getWeaponType",
            "fire", "BNTest$IWeaponBehavior$fire"
            ]
        },
        ctor: function (entity) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);
            entity.useSwingAnimation = true;
        },
        getEnergyCost: function () {
            //return 3.5f;
            //return 10f;
            return 9.2;
        },
        getMaxCooldown: function () {
            return (((this._maxAmmo * this._maxShotDelay) | 0)) + this.minCoolDown;
        },
        setFiringAngle: function (value) {
            this._angle = value;
        },
        getWeaponType: function () {
            return 1;
        },
        update: function () {
            if (this._ammo > 0) {
                if (this.active) {
                }
                this._shotDelay = (this._shotDelay - 1) | 0;
                if (this._shotDelay <= 0) {
                    this._shotDelay = this._maxShotDelay;
                    this._ammo = (this._ammo - 1) | 0;
                    if (this.entity.getHandledLocally()) {
                        var ang = BNTest.MathHelper.degreesToRadians(this._angle + 90);
                        var D = {  };
                        D.A = this._angle;

                        //float inaccuracy = 0.10f;
                        var inaccuracy = 0.13;
                        var V = BNTest.Vector2.fromRadian(-inaccuracy + (Math.random() * (inaccuracy + inaccuracy)) + ang);

                        var V1 = BNTest.Vector2.op_Multiply(V, 40);
                        D.SX = V1.x;
                        D.SY = V1.y;
                        var P = BNTest.GLVec3.op_Addition$1(this.entity.getCenter(), (V));
                        D.X = P.x;
                        D.Y = P.y;
                        D.Z = P.z;
                        this.entity.forcedAngle = this._angle;
                        this.entity.frictionActive = false;
                        if (!this.active) {
                            this.customEvent(D);
                        }
                    }

                }
            } else if (this.active) {
                this.entity.forcedAngle = null;
                this.entity.frictionActive = true;
                this.active = false;
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        },
        customEvent: function (evt) {
            //entity.PlaySound("pew");
            //entity.PlaySound("jump");

            var P = new BNTest.Projectile(this.entity.world, this.entity);
            P.solid = false;
            var M = new BNTest.Model(this.entity.game);
            M.meshes.add(this.bulletGraphic);
            P.model = M;

            //P.touchDamage = 7.5f;
            //P.touchDamage = 15f;
            //P.touchDamage = 35f;
            P.settouchDamage(80.0);

            //P.AddBehavior(new LifeSpan(P, 60));

            M.rotation.y = evt.A;

            //double size = 30;
            var size = 30;
            var HSZ = new BNTest.GLVec3.ctor(size, size, size);
            M.customBoundingBox = new BNTest.BoundingBox.$ctor1(BNTest.GLVec3.op_Multiply$1(HSZ, -1), HSZ);
            P.customBoundingBox = M.customBoundingBox;

            P.setx(evt.X);
            P.sety(evt.Y + 2);
            P.setz(evt.Z);

            P.setScale(BNTest.GLVec3.createUniform(3.0));

            var lifespan = (this._maxShotDelay * this._maxAmmo) | 0;
            lifespan = (lifespan + 3) | 0;
            //P.Solid = true;
            P.obstruction = true;
            P.speed = BNTest.GLVec3.op_Addition$1(new BNTest.GLVec3.ctor(), new BNTest.Vector2(evt.SX, evt.SY).normalize(2.5));
            P.speed = BNTest.GLVec3.op_Addition(P.speed, this.entity.speed.clone());


            P.addBehavior(new BNTest.LifeSpan(P, lifespan));
            this.entity.world.add(P);

            this.active = true;
            this.speed = BNTest.GLVec3.op_Addition$1(new BNTest.GLVec3.ctor(), new BNTest.Vector2(evt.SX, evt.SY));
            P.setPosition(BNTest.GLVec3.op_Addition(P.getPosition(), BNTest.GLVec3.op_Multiply$1(this.speed, 0.5)));

        },
        fire: function (angle) {
            this._angle = angle;
            this._ammo = this._maxAmmo;
        }
    });

    Bridge.define("BNTest.Coin", {
        inherits: [BNTest.Entity],
        value: 10,
        pickupDelay: 0,
        ctor: function (world, lifespan) {
            if (lifespan === void 0) { lifespan = 900; }

            this.$initialize();
            BNTest.Entity.ctor.call(this, world);
            this.game = world.game;
            this.model = new BNTest.Model(this.game);
            var smooth = this.game.smooth;
            this.customBoundingBox = new BNTest.BoundingBox.$ctor2(10);
            var mdl = "coin";
            var tmdl = BNTest.ModelCache.get_this().get(mdl, false);
            if (tmdl != null) {
                console.log(System.String.concat(System.String.concat("loading \"", mdl), "\" model from cache."));
                //model.CopyFrom(tmdl);
                this.model.copyFrom(tmdl, true);
                this.model.alpha = 1;
                this.model.setVisible(true);
            } else {
                var coin = "object/coin";
                //coin = "object/yinyangorb";
                BNTest.AnimationLoader.get_this().asyncGet$1([coin], Bridge.fn.bind(this, function () {
                    if (this.model != null) {
                        this.model.unloadBuffers();
                        world.remove$1(this.model);
                    }
                    var off = this.model.offset;
                    this.model.clear();
                    this.model.offset = off;
                    this.model.scale = BNTest.GLVec3.op_Multiply$1(this.model.scale, 0.5);


                    //world.Add(model);

                    //VoxelMap box = Game.GetVoxelCombo(new string[] { "object/coin" });
                    //VoxelMap box = VoxelMap.FromImages("object/coin");
                    var box = BNTest.VoxelMap.fromImages$1(coin);
                    var M2 = new BNTest.Mesh(this.game);
                    M2.addVoxelMap(box, smooth);
                    var md;

                    box.setColor(new BNTest.GLColor());
                    var M = new BNTest.Mesh(this.game);

                    M.addVoxelMap(box, smooth);




                    var M3 = M.clone();
                    md = new BNTest.Model(this.game);
                    //md.color = new GLColor(1, 0, 0);
                    //md.Scale = new GLVec3(1.1, 1.1, 1.1);
                    //md.meshes.Add(M);
                    md.meshes.add(M3);
                    M3.scale = BNTest.GLVec3.createUniform(1.1);
                    M3.updateTranformation();
                    M3.flattenGeometry();
                    //model.children.Add(md);

                    md = new BNTest.Model(this.game);
                    M.scale = new BNTest.GLVec3.ctor(0.8, 0.8, 0.8);
                    md.meshes.add(M);
                    M.updateTranformation();
                    M.flattenGeometry();
                    M.combine(M3);
                    this.model.children.add(md);

                    md = new BNTest.Model(this.game);
                    md.bleedThrough = true;
                    md.meshes.add(M2);
                    this.model.children.add(md);

                    //force this model back to prevent main part of coin from doing a bleed through.
                    world.sendToBack(this.model);


                    /* md = new Model(Game);
                    md.Depthfunc = Game.gl.GREATER;*/
                    //model.children.Add(md);
                    //model.meshes.Add(M);
                    if (tmdl == null) {
                        BNTest.ModelCache.get_this().set$1("coin", this.model);
                    }
                }));
            }
            this.solid = false;
            var HP = new BNTest.LifeSpan(this, lifespan, 120);
            this.addBehavior(HP);
        },
        setValue: function (Value) {
            if (Value < 10) {
                this.setScale(BNTest.GLVec3.createUniform((Value * 0.1) * 0.5));
                this.value = Value;
                this.customBoundingBox = BNTest.BoundingBox.op_Multiply$1(this.customBoundingBox, this.model.scale.x);
                return;
            }
            var rank = 0;
            var val = Value;
            while (val >= 500) {
                val *= 0.002;
                rank = (rank + 1) | 0;
            }
            //var scale = 1 + (val * 0.0020);
            //var scale = 1 + (val * 0.0040);
            var scale = 1 + (val * 0.005);
            if (rank > 0) {
                var T = [new BNTest.GLColor(1, 1, 0), new BNTest.GLColor(0, 0, 1), new BNTest.GLColor(1, 0, 0), new BNTest.GLColor(1, 0, 1)];
                var C = T[rank];
                this.setColor(C);
            }
            this.setScale(BNTest.GLVec3.createUniform(scale * 0.5));
            this.value = Value;
            this.customBoundingBox = BNTest.BoundingBox.op_Multiply$1(this.customBoundingBox, this.model.scale.x);
        },
        setColor: function (color) {
            var P = this.model.offset;
            this.model = this.model.clone();
            this.model.offset = P;
            var M = this.model.children.getItem(2);
            //M.meshes[0] = M.meshes[0].Clone(false);
            M.meshes.getItem(0).replaceAllColors(color);
        },
        update: function () {
            this.model.rotation.y += 5;
            //model.Rotation.X = 45;

            BNTest.Entity.prototype.update.call(this);


            var player = this.world.game.localplayer.character;
            var BS = this.lastBB.getSize();
            //Speed.Y = 0;
            this.speed = BNTest.GLVec3.op_Multiply$1(this.speed, 0.96);

            if (this.world.findSolidCollision$2(BNTest.GLVec3.op_Addition(this.getPosition(), new BNTest.GLVec3.ctor(0, (BS.y) + 1, 0))).length > 0) {
                //Position.Y += 1;
                this.speed.y = 0;
            } else {

                this.speed.y += 0.05;
            }
            if (this.pickupDelay > 0) {
                this.pickupDelay = (this.pickupDelay - 1) | 0;
            } else if (player.restTime >= 15 && player.invincibilityFrames <= 0) {
                var dist = this.getPosition().roughDistance(player.getPosition());

                //if (dist < 40)
                if (dist < 110) {
                    var spd = 2.5 - (dist * 0.01);
                    var S = (BNTest.GLVec3.op_Subtraction(player.getPosition(), this.getPosition())).normalize(spd);
                    this.speed.x = S.x;
                    this.speed.y = S.y;
                    this.speed.z = S.z;
                }
            }
            if (this.pickupDelay <= 0 && BS.getRoughLength() > 0 && player.lastBB.getSize().getRoughLength() > 0 && player.lastBB.intersection$2(this.lastBB)) {
                var val = this.value;
                /* if (model.Scale.X>1)
                    {
                        //val = ((int)(val * model.Scale.X) * 5);
                        val = ((int)(val * model.Scale.X) * 10);
                    }*/
                player.setCoins((player.getCoins() + val) | 0);
                this.playSound("powerup");
                this.alive = false;
            }
        },
        draw: function (gl) {
            BNTest.Entity.prototype.draw.call(this, gl);
        }
    });

    Bridge.define("BNTest.ControllableEntity", {
        inherits: [BNTest.Entity],
        controller: null,
        lController: null,
        ctor: function (world) {
            this.$initialize();
            BNTest.Entity.ctor.call(this, world);
            this.controller = System.Array.init(7, false);
            this.lController = System.Array.init(this.controller.length, false);
        }
    });

    Bridge.define("BNTest.DonationBox", {
        inherits: [BNTest.Entity],
        defaultMaxHP: 40,
        maxHP: 0,
        HP: 0,
        coinsToRelease: 0,
        ctor: function (world) {
            this.$initialize();
            BNTest.Entity.ctor.call(this, world);
            this.game = world.game;
            this.model = new BNTest.Model(this.game);
            var smooth = this.game.smooth;
            this.solid = true;
            this.customBoundingBox = new BNTest.BoundingBox.$ctor2(20);
            this.customBoundingBox.min.y = -2;
            this.lastBB = this.customBoundingBox.clone();

            BNTest.AnimationLoader.get_this().asyncGet$1(["object/donationBox", "object/donationBoxTop"], Bridge.fn.bind(this, function () {
                if (this.model != null) {
                    this.model.unloadBuffers();
                    world.remove$1(this.model);
                }
                this.model.clear();
                this.HP = (this.maxHP = this.defaultMaxHP);
                world.add$1(this.model);

                var box = this.game.getVoxelCombo(["object/donationBox", "object/donationBoxTop"]);
                //body.ApplyPalette(pal);
                var M = new BNTest.Mesh(this.game);

                M.addVoxelMap(box, smooth);
                this.model.meshes.add(M);
                //CacheBoundingBox();
            }));
        },
        update: function () {
            var $t;
            if (this.lastBB == null) {
                this.lastBB = new BNTest.BoundingBox.ctor();
            }
            if (this.game.ended) {
                return;
            }
            var B = BNTest.BoundingBox.op_Multiply$1(this.lastBB, 1.5);
            var L = this.world.findSolidCollision(B, this);
            var PC = this.game.localplayer.character;
            /* if (Scale.X >= 1)
                {*/
            var P = System.Linq.Enumerable.from(L).where($_.BNTest.DonationBox.f1).toArray();
            if (P.length > 0) {
                this.HP -= (0.5 + (P.length * 0.5));
                //Helper.Log("enemy attacking, box HP:"+HP);
                if (this.HP <= 0) {
                    if (PC.getCoins() >= 10) {
                        this.coinsToRelease = (this.coinsToRelease + 1) | 0;
                        this.HP = this.maxHP;
                    }
                }
            }
            /* }
                else*/
            if (this.coinsToRelease > 0 && PC.getCoins() <= 0) {
                this.coinsToRelease = 0;
            }
            if (this.coinsToRelease > 0) {
                var i = this.coinsToRelease;
                while (i > 0) {
                    this.setScale(BNTest.GLVec3.op_Multiply$1(this.getScale(), 0.96));
                    i = (i - 1) | 0;
                }
                if (this.getScale().x <= 0.6) {
                    this.coinsToRelease = (this.coinsToRelease - 1) | 0;
                    var Val = Math.min(PC.getCoins(), 10);
                    PC.setCoins((PC.getCoins() - Val) | 0);
                    var c = new BNTest.Coin(this.world);
                    c.setPosition(BNTest.GLVec3.op_Addition(this.getPosition(), new BNTest.GLVec3.ctor(0, -20, 0)));
                    c.solid = false;
                    var m = 3;
                    var m2 = (m + m) | 0;
                    c.speed = new BNTest.GLVec3.ctor(((-m) | 0) + (Math.random() * m2), 0, ((-m) | 0) + (Math.random() * m2));
                    c.speed.y = -1 + (((-m) | 0) * Math.random());
                    if (Val !== 10) {
                        c.setValue(Val);
                    }
                    this.world.add(c);
                    this.getScale().x = ($t = (this.getScale().z = 1, 1), this.getScale().y = $t, $t);
                }
            }

            BNTest.Entity.prototype.update.call(this);
        },
        draw: function (gl) {
            BNTest.Entity.prototype.draw.call(this, gl);
        }
    });

    Bridge.ns("BNTest.DonationBox", $_);

    Bridge.apply($_.BNTest.DonationBox, {
        f1: function (E) {
            return E.controller != null && E.team !== 0;
        }
    });

    Bridge.define("BNTest.EnemyEngager", {
        inherits: [BNTest.EntityBehavior],
        target: null,
        sightRange: 400,
        predict: true,
        /**
         * If true, this behavior will not be active if the entity's HP is 100 or more.
         *
         * @instance
         * @public
         * @memberof BNTest.EnemyEngager
         * @default false
         * @type boolean
         */
        passive: false,
        ignore: null,
        retaliates: true,
        config: {
            init: function () {
                this.ignore = new (System.Collections.Generic.List$1(BNTest.Entity))();
            }
        },
        ctor: function (entity) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);
        },
        onAttacked: function (source) {
            var E = source.BNTest$IHarmfulEntity$getAttacker();
            if (this.retaliates && !Bridge.referenceEquals(E, this.entity)) {
                this.target = E;
            }
        },
        update: function () {
            var controller = this.entity.controller;
            var N = this.entity.getBehavior(BNTest.NavigatorAI);
            if (N == null) {
                N = new BNTest.NavigatorAI(Bridge.cast(this.entity, BNTest.ControllableEntity));
                N.framesPerTick = (Bridge.Int.div(this.framesPerTick, 3)) | 0;
                this.entity.addBehavior(N);
            }
            /* if (passive && entity.As<PlayerCharacter>().HP>=100)
                {
                    controller[5] = false;
                    return;
                }*/
            //if (N.MoveTo == null)
            {
                var P = this.entity.getPosition();
                if (this.target != null) {
                    if (P.roughDistance(this.target.model.offset) > this.sightRange) {
                        this.target = null;
                    }
                }
                if (this.target == null && !this.passive) {
                    var L = this.entity.world.entities;
                    var ln = L.getCount();
                    var i = 0;
                    while (i < ln) {
                        var E = L.getItem(i);
                        if (E.char) {
                            var EP = E;
                            if (!this.entity.sameTeam(EP) && !this.ignore.contains(E)) {
                                if (P.roughDistance(EP.model.offset) <= this.sightRange) {
                                    this.target = EP;
                                    i = ln;
                                }
                            }
                        }
                        i = (i + 1) | 0;
                    }
                }

                if (this.target != null) {
                    controller[5] = true;

                    var Pos = this.target.getPosition().clone();
                    if (this.predict) {
                        Pos = BNTest.GLVec3.op_Addition(Pos, BNTest.GLVec3.op_Multiply$1(this.target.speed, 30));
                    }
                    N.requestMoveTo(Pos, 0.5);
                } else {
                    controller[5] = false;
                }
                //N.MoveTo = Target.Position.Clone();

                /* double maxrange = 60;
                    double mr2 = maxrange + maxrange;
                    //GLVec3 V = new GLVec3(Math.Random()*maxrange, Math.Random() * maxrange, Math.Random() * maxrange) + entity.Position;
                    GLVec3 V = new GLVec3(-maxrange + (Math.Random() * mr2), 0, -maxrange + (Math.Random() * mr2)) + entity.Position;
                    N.RequestMoveTo(V, 0.4f);*/
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        }
    });

    Bridge.define("BNTest.EnemyStrafer", {
        inherits: [BNTest.EntityBehavior],
        target: null,
        sightRange: 400,
        predict: true,
        /**
         * If true, this behavior will not be active if the entity's HP is 100 or more.
         *
         * @instance
         * @public
         * @memberof BNTest.EnemyStrafer
         * @default false
         * @type boolean
         */
        passive: false,
        attackrange: 999999,
        ang: 0.1,
        frame: 0,
        attackType: 5,
        ignore: null,
        retaliates: true,
        config: {
            init: function () {
                this.ignore = new (System.Collections.Generic.List$1(BNTest.Entity))();
            }
        },
        ctor: function (entity) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);
        },
        onAttacked: function (source) {
            var E = source.BNTest$IHarmfulEntity$getAttacker();
            if (this.retaliates && !Bridge.referenceEquals(E, this.entity)) {
                this.target = E;
            }
        },
        update: function () {
            this.frame = (this.frame + 1) | 0;
            var controller = this.entity.controller;
            var N = this.entity.getBehavior(BNTest.NavigatorAI);
            if (N == null) {
                N = new BNTest.NavigatorAI(Bridge.cast(this.entity, BNTest.ControllableEntity));
                N.framesPerTick = (Bridge.Int.div(this.framesPerTick, 3)) | 0;
                this.entity.addBehavior(N);
            }
            {
                var P = this.entity.getPosition();
                var D = 0.0;
                if (this.target != null) {
                    D = P.roughDistance(this.target.model.offset);
                    if (D > this.sightRange) {
                        this.target = null;
                    }
                }
                if (this.target == null && !this.passive) {
                    var L = this.entity.world.entities;
                    var ln = L.getCount();
                    var i = 0;
                    while (i < ln) {
                        var E = L.getItem(i);
                        if (E.char) {
                            var EP = E;
                            if (!this.entity.sameTeam(EP) && !this.ignore.contains(E)) {
                                if (P.roughDistance(EP.model.offset) <= this.sightRange) {
                                    this.target = EP;
                                    i = ln;
                                }
                            }
                        }
                        i = (i + 1) | 0;
                    }
                }

                if (this.target != null) {
                    var PC = this.entity;
                    /* entity.model.color = new GLColor(1, 1, 1);
                        PC.flickerColor = null;
                        float maxflicker = 40;*/
                    //entity.model.color = new GLColor(1, 0, 0);
                    /* bool ok = true;
                        ok = !PC.manaburnout;
                        if (!ok)
                        {
                            ok = PC.ammo + (PC.ammoRechargeRate * 60) >= PC.maxAmmo;
                        }
                        if (ok)
                        {
                            PC.flickerColor = new GLColor(1, 0, 0);
                        }*/
                    if (D <= this.attackrange) {
                        controller[this.attackType] = true;

                        //if (entity["char"] != null)
                        /* {
                                RapidFireGun T2 = entity.GetBehavior<IWeaponBehavior>().As<RapidFireGun>();
                            
                                //ok = !PC.manaburnout || T2["_ammo"].As<int>() > 0;
                                var ok = !PC.manaburnout;
                                if (!ok)
                                {
                                    ok = PC.ammo + (PC.ammoRechargeRate * maxflicker) >= PC.maxAmmo;
                                }
                                ok = true;
                                if (ok)
                                {
                                    PC.flickerColor = new GLColor(1, 0, 0);
                                }
                            }*/
                    } else {
                        controller[this.attackType] = false;
                        /* entity.model.color = new GLColor(1, 1, 1);
                            if (PC.ammo + (PC.ammoRechargeRate * maxflicker) >= PC.maxAmmo)
                            {
                                PC.ammo = PC.maxAmmo - (PC.ammoRechargeRate * maxflicker);
                            }*/
                    }


                    var Pos = this.target.getPosition().clone();
                    if (this.predict) {
                        Pos = BNTest.GLVec3.op_Addition(Pos, BNTest.GLVec3.op_Multiply$1(this.target.speed, 30));
                    }
                    var rl = (BNTest.GLVec3.op_Subtraction(Pos, this.entity.getPosition())).toVector2();
                    var rel = BNTest.MathHelper.radiansToDegrees(rl.toAngle());
                    this.entity.model.rotation.y = rel - 90;
                    N.setsAngle = false;
                    var A = this.ang;
                    if (D > this.attackrange * 0.75) {
                        A = (A + A);
                    } else if (D < (this.sightRange * 0.6)) {
                        //increase distance if too close.
                        A = -(A + A);
                    }
                    var NV = BNTest.GLVec3.op_Addition$1(this.entity.getPosition(), rl.rotate(1.57 - A));
                    N.requestMoveTo(NV, 0.5);
                } else {
                    controller[this.attackType] = false;
                    N.setsAngle = true;
                }
                //N.MoveTo = Target.Position.Clone();

                /* double maxrange = 60;
                    double mr2 = maxrange + maxrange;
                    //GLVec3 V = new GLVec3(Math.Random()*maxrange, Math.Random() * maxrange, Math.Random() * maxrange) + entity.Position;
                    GLVec3 V = new GLVec3(-maxrange + (Math.Random() * mr2), 0, -maxrange + (Math.Random() * mr2)) + entity.Position;
                    N.RequestMoveTo(V, 0.4f);*/
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        }
    });

    Bridge.define("BNTest.EntityFollower", {
        inherits: [BNTest.EntityBehavior],
        target: null,
        ctor: function (entity, target) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);
            this.target = target;
        },
        update: function () {
            var N = this.entity.getBehavior(BNTest.NavigatorAI);
            if (N == null) {
                N = new BNTest.NavigatorAI(Bridge.cast(this.entity, BNTest.ControllableEntity));
                N.framesPerTick = (Bridge.Int.div(this.framesPerTick, 3)) | 0;
                this.entity.addBehavior(N);
            }
            //if (N.MoveTo == null)
            {
                //N.MoveTo = Target.Position.Clone();
                N.requestMoveTo(this.target.getPosition().clone(), 0.4);
                /* double maxrange = 60;
                    double mr2 = maxrange + maxrange;
                    //GLVec3 V = new GLVec3(Math.Random()*maxrange, Math.Random() * maxrange, Math.Random() * maxrange) + entity.Position;
                    GLVec3 V = new GLVec3(-maxrange + (Math.Random() * mr2), 0, -maxrange + (Math.Random() * mr2)) + entity.Position;
                    N.RequestMoveTo(V, 0.4f);*/
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        }
    });

    Bridge.define("BNTest.Foliage", {
        inherits: [BNTest.Entity],
        current: null,
        ctor: function (world) {
            this.$initialize();
            BNTest.Entity.ctor.call(this, world);
            this.game = world.game;
            this.model = new BNTest.Model(this.game);
            this.solid = false;
            /* current = new Mesh(Game);
                model.meshes.Add(current);*/
            this.model.setVisible(false);
            //model.znearRate = 0.65;

            this.model.forceRender = true;
            this.customBoundingBox = new BNTest.BoundingBox.$ctor2(1);
        },
        addPatch: function (position, color, size, thickness, scale) {
            if (thickness === void 0) { thickness = 0.7; }
            if (scale === void 0) { scale = 1.0; }
            var VM = new BNTest.VoxelMap();
            var N = System.Array.create(null, null, size, 1, size);
            var X = 0;
            var Y = 0;
            var Z = 0;
            var min = (Bridge.Int.div(size, 4)) | 0;
            var max = (size - min) | 0;
            var S = size * 0.5;
            while (X < System.Array.getLength(N, 0)) {
                while (Y < System.Array.getLength(N, 1)) {
                    while (Z < System.Array.getLength(N, 2)) {
                        var V = new BNTest.GLVec3.ctor(X - S, 0, Z - S);
                        //if (MathHelper.Within(X, min, max) && MathHelper.Within(Y, min, max) && MathHelper.Within(Z, min, max))
                        var VL = V.getLength();
                        if (VL <= S) {
                            var amod = 0.25;
                            var mod = (amod + (VL / S)) / (amod + 1);
                            if ((Math.random() * mod) < (thickness)) {
                                N.set([X, Y, Z], color);
                            }
                        }
                        Z = (Z + 1) | 0;
                    }
                    Z = 0;
                    Y = (Y + 1) | 0;
                }
                Y = 0;
                Z = 0;
                X = (X + 1) | 0;
            }
            VM.map = N;
            VM.addNoise(0.15);

            var M = new BNTest.Mesh(this.game);
            M.addVoxelMap(VM, false, true, true);
            M.offset = position;
            if (scale !== 1) {
                M.scale = BNTest.GLVec3.op_Multiply$1(M.scale, scale);
            }
            M.rotation.y = Math.random() * 360;
            this.addFoliage(M);

            //model.meshes.Add(M);
        },
        addFlatShrub: function (position, color, scale) {
            if (scale === void 0) { scale = 1.0; }
            /* VoxelMap VM = new VoxelMap();
                GLColor[,,] N = new GLColor[3, 1, 3];
                N[1, 0, 0] = N[1, 0, 2] = N[0, 0, 1] = N[2, 0, 1] = petal;
                N[1, 0, 1] = inner;

                VM.Map = N;
                Mesh M = new Mesh(Game);
                M.AddVoxelMap(VM, false, true, true);
                M.Offset = position;
                if (scale != 1)
                {
                    M.Scale *= scale;
                }
                M.Rotation.Y = Math.Random() * 360;
                AddFoliage(M);*/
            var VM = new BNTest.VoxelMap();
            var N = System.Array.create(null, null, 10, 1, 10);
            VM.map = N;
            VM.fill(new BNTest.BoundingBox.$ctor1(new BNTest.GLVec3.ctor(), new BNTest.GLVec3.ctor(10, 1, 10)), color);
            VM.addNoise(0.1);
            VM.addHoles(0.6);

            var M = new BNTest.Mesh(this.game);
            M.addVoxelMap(VM, false, true, true);
            M.offset = position;
            if (scale !== 1) {
                M.scale = BNTest.GLVec3.op_Multiply$1(M.scale, scale);
            }
            M.rotation.y = Math.random() * 360;
            this.addFoliage(M);
        },
        addShrub: function (position, color, scale) {
            if (scale === void 0) { scale = 1.0; }

            var Char = "shrub";
            var tmdl = BNTest.ModelCache.get_this().get(Char, false);
            var M = null;
            var size = 30;

            if (tmdl != null) {
                console.log(System.String.concat(System.String.concat("loading \"", Char), "\" model from cache."));

                M = tmdl.meshes.getItem(0).clone();
            } else {

                var VM = BNTest.VoxelMap.generateRock(size, color, 0.9);
                VM.addNoise(0.07);

                M = new BNTest.Mesh(this.game);
                M.addVoxelMap(VM, true);

                var T = new BNTest.Model(this.game);
                T.meshes.add(M);
                BNTest.ModelCache.get_this().set$1(Char, T);

            }


            M.offset = position;
            M.offset.y -= ((((Bridge.Int.div(size, 4)) | 0)) * scale);
            M.rotation.y = Math.random() * 360;
            if (scale !== 1) {
                M.scale = BNTest.GLVec3.op_Multiply$1(M.scale, scale);
            }
            this.addFoliage(M);
        },
        addFlower: function (position, petal, inner, scale) {
            var $t, $t1;
            if (inner === void 0) { inner = null; }
            if (scale === void 0) { scale = 1.0; }
            if (inner == null) {
                if (!(petal.r === petal.g && petal.b === 0 && petal.r > 0)) {
                    inner = new BNTest.GLColor(1, 1);
                } else {
                    //inner = new GLColor(1, 1, 1);
                    inner = new BNTest.GLColor(0.7, 0.7, 0);
                }
            }
            var VM = new BNTest.VoxelMap();
            var N = System.Array.create(null, null, 3, 1, 3);
            N.set([1, 0, 0], ($t = ($t1 = (N.set([2, 0, 1], petal), petal), N.set([0, 0, 1], $t1), $t1), N.set([1, 0, 2], $t), $t));
            N.set([1, 0, 1], inner);

            VM.map = N;
            var M = new BNTest.Mesh(this.game);
            M.addVoxelMap(VM, false, true, true);
            M.offset = position;
            if (scale !== 1) {
                M.scale = BNTest.GLVec3.op_Multiply$1(M.scale, scale);
            }
            M.rotation.y = Math.random() * 360;
            this.addFoliage(M);
        },
        absorbModel: function (E) {
            this.absorbModel$1(E.model);
        },
        absorbModel$1: function (M, baseTransform) {
            if (baseTransform === void 0) { baseTransform = null; }
            M.updateTransform();
            if (baseTransform == null && M.transformed) {
                baseTransform = M.transformation.clone();
            } else if (M.transformed) {
                baseTransform.multiplyMatrix(M.transformation);
            }
            if (baseTransform == null) {
                baseTransform = new BNTest.WGMatrix();
            }
            M.setVisible(false);
            var matrix;
            var i = 0;
            while (i < M.meshes.getCount()) {
                var C = M.meshes.getItem(i);
                matrix = M.transformation.clone();
                if (C.transformation != null && C.transformed) {
                    matrix.multiplyMatrix(C.transformation);
                }
                C.morphGeometry(matrix);
                this.addFoliage(C);
                i = (i + 1) | 0;
            }
            i = 0;
            while (i < M.children.getCount()) {
                this.absorbModel$1(M.children.getItem(i), baseTransform.clone());
                i = (i + 1) | 0;
            }
        },
        addFoliage: function (M) {
            if (this.current == null || ((this.current.indices.length + M.indices.length) | 0) >= 44500) {
                this.current = new BNTest.Mesh(this.game);
                this.model.meshes.add(this.current);
            }
            M.flattenGeometry();
            this.current.combine(M, true);
            //model.meshes.Add(M);
            this.model.setVisible(true);

            /* M.FlattenGeometry();
                model.meshes.Add(M);*/
            /* if (current.Indices.Length+M.Indices.Length < 44500)
                {
                    M.FlattenGeometry();
                    current.Combine(M, false);
                }
                else
                {
                    current = M;
                    model.meshes.Add(M);
                }*/
        },
        update: function () {
            BNTest.Entity.prototype.update.call(this);
            //Position.Y = -(CustomBoundingBox.Max.Y);
            //Position.Y = (CustomBoundingBox.Min.Y);
            //Position.Y = -(size / 2) + 10;
        },
        draw: function (gl) {
            BNTest.Entity.prototype.draw.call(this, gl);
        }
    });

    Bridge.define("BNTest.LifeSpan", {
        inherits: [BNTest.EntityBehavior],
        HP: 0,
        flickerTime: 0,
        frame: 0,
        fadeTime: 15,
        ctor: function (entity, HP, flickerTime) {
            if (flickerTime === void 0) { flickerTime = 0; }

            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);
            this.HP = HP;
            this.flickerTime = flickerTime;
        },
        update: function () {
            this.HP = (this.HP - 1) | 0;
            if (this.HP <= 0) {
                this.entity.alive = false;
            } else if (this.flickerTime > 0 && this.HP < this.flickerTime) {
                this.frame = (this.frame + 1) | 0;
                if ((this.frame & 1) > 0) {
                    this.entity.model.setVisible(!this.entity.model.getVisible());
                }
            }
            if (this.HP < this.fadeTime) {
                this.entity.model.alpha = this.HP / this.fadeTime;
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        }
    });

    Bridge.define("BNTest.NavigatorAI", {
        inherits: [BNTest.EntityBehavior],
        canJump: true,
        setsAngle: true,
        _lastProgress: System.Int64.toNumber(System.Int64([1874919423,2328306])),
        _timeSinceLastProgress: 0,
        persistence: 45,
        _movementPriority: 0,
        _moveTo: null,
        ctor: function (entity) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);

        },
        getMoveTo: function () {
            return this._moveTo;
        },
        setMoveTo: function (value) {
            if (Bridge.referenceEquals(this._moveTo, value)) {
                return;
            }
            this._lastProgress = System.Int64([1874919423,2328306]);
            this._timeSinceLastProgress = 0;
            this._moveTo = value;
        },
        requestMoveTo: function (position, priority, onlyIfHigher) {
            if (priority === void 0) { priority = 0.5; }
            if (onlyIfHigher === void 0) { onlyIfHigher = false; }
            var ok = priority > this._movementPriority;
            if (!onlyIfHigher && !ok && priority === this._movementPriority) {
                ok = true;
            }
            if (ok) {
                if (!Bridge.referenceEquals(position, this._moveTo)) {
                    this.setMoveTo(position);
                    if (Bridge.referenceEquals(this.getMoveTo(), position)) {
                        this._movementPriority = priority;
                        if (this.entity.getHandledLocally()) {
                            var D = {  };
                            D.T = "MT";
                            D.X = this._moveTo.x;
                            D.Y = this._moveTo.y;
                            D.P = this._movementPriority;
                            this.sendCustomEvent(D, true);

                            if (this.entity.getHandledLocally()) {
                                this.entity.refreshBehaviorTick(BNTest.NetworkSync);
                            }
                        }
                    }
                }
            }
            return false;
        },
        customEvent: function (evt) {
            if (Bridge.referenceEquals(evt.T, "MT")) {
                this.requestMoveTo(new BNTest.GLVec3.ctor(evt.X, evt.Y, evt.Z), evt.P);
            }
            if (Bridge.referenceEquals(evt.T, "R")) {
                this.reset();
            }

        },
        resetController: function () {
            var controller = this.entity.controller;
            controller[0] = false;
            controller[1] = false;
            controller[2] = false;
            controller[3] = false;
        },
        reset: function () {
            this.resetController();
            this._moveTo = null;
            this._movementPriority = -1;
        },
        update: function () {
            if (this._moveTo != null) {
                var controller = this.entity.controller;
                var lcontroller = this.entity.lController;
                var relative = BNTest.GLVec3.op_Subtraction(this._moveTo, this.entity.getPosition());
                var V = BNTest.GLVec3.op_Addition(this.entity.getPosition(), (BNTest.GLVec3.op_Multiply$1(relative, 0.5)));
                if (this.entity.world.findSolidCollision(new BNTest.BoundingBox.$ctor1(V, BNTest.GLVec3.op_Addition(V, new BNTest.GLVec3.ctor(0, 100, 0)))).length < 1) {
                    //unsafe to proceed
                    if (this.entity.getHandledLocally()) {
                        var D = {  };
                        D.T = "R";
                        this.sendCustomEvent(D, true);
                    }
                    this.reset();
                    return;
                }
                this.resetController();

                //if (Math.Abs(relative.Z) > Math.Abs(relative.X))
                if (Math.abs(relative.z) > 1) {
                    if (relative.z > 0) {
                        controller[3] = true;
                    } else {
                        controller[2] = true;
                    }
                } else {
                    controller[3] = (controller[2] = false, false);
                }
                if (Math.abs(relative.x) > 1) {
                    controller[0] = relative.x < 0;
                    controller[1] = relative.x > 0;
                } else {
                    controller[0] = (controller[0] = false, false);
                }

                var currentProgress = relative.getRoughLength();
                if (this._lastProgress > currentProgress) {
                    this._lastProgress = currentProgress;
                    this._timeSinceLastProgress = 0;
                } else {
                    this._timeSinceLastProgress += Math.max(1, this.framesPerTick);
                    if (this._timeSinceLastProgress > this.persistence || currentProgress < 4) {
                        if (this.entity.getHandledLocally()) {
                            var D1 = {  };
                            D1.T = "R";
                            this.sendCustomEvent(D1, true);
                        }
                        this.reset();
                        return;
                    }
                }

                if (Bridge.is(this.entity, BNTest.PlatformerEntity)) {
                    var Platformer = this.entity;
                    if (this.canJump) {
                        if (Platformer.cantstep && Platformer.getPosition().y > -250) {
                            controller[4] = true;
                        } else {
                            controller[4] = false;
                        }
                    }
                    //controller[5] = true;
                    if (this.setsAngle) {
                        Platformer.model.rotation.y = BNTest.MathHelper.radiansToDegrees(relative.toVector2().toAngle()) - 90;
                    }
                    /* if (!Platformer.onGround)
                        {
                            controller[2] = false;
                        }
                        if (Platformer.RightWall != null && controller[1])
                        {
                            controller[3] = false;
                            controller[2] = true;
                        }
                        if (Platformer.LeftWall != null && controller[0])
                        {
                            controller[3] = false;
                            controller[2] = true;
                        }
                        if (Platformer.Vspeed>=0 && Platformer.Floor != null)
                        {
                            TileData T = Platformer.Floor;
                        
                            TileData T2 = T.GetTileData(controller[0] ? -1 : 1, 0);

                            if (T2 == null || !T2.topSolid)
                            {
                                int max = 5;
                                while (max > 0)
                                {
                                    T2 = T2.GetTileData(0, 1);
                                    if (T2 == null || !T2.topSolid)
                                    {
                                        max--;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }
                                if (max<=0)
                                {
                                    controller[3] = false;
                                    controller[2] = true;
                                }
                            }
                        }
                        if (!Platformer.onGround && FramesPerTick<1)
                        {
                            controller[3] = false;
                            controller[2] = true;
                        }*/
                }

                if ((controller[0] && lcontroller[1]) || (controller[1] && lcontroller[0])) {
                    if (currentProgress < 150) {
                        this.reset();
                        if (this.entity.getHandledLocally()) {
                            var D2 = {  };
                            D2.T = "R";
                            this.sendCustomEvent(D2, true);
                        }
                    } else if (Math.abs(relative.x) < 150) {
                        controller[0] = false;
                        controller[1] = false;
                    }
                }
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        }
    });

    Bridge.define("BNTest.NetworkSync", {
        inherits: [BNTest.EntityBehavior],
        timer: 0,
        automaticSyncInterval: 0,
        fields: null,
        lFields: null,
        needsSync: false,
        forcesFlush: false,
        updating: false,
        updateOnSync: false,
        ctor: function (entity) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);
            this.fields = new (System.Collections.Generic.List$1(String))();
            this.setBehaviorName("NS");
        },
        addField: function (fieldName) {
            if (!this.fields.contains(fieldName)) {
                this.fields.add(fieldName);
                return true;
            }
            return false;
        },
        addFields: function (fieldNames) {
            var $t;
            $t = Bridge.getEnumerator(fieldNames);
            while ($t.moveNext()) {
                var fieldName = $t.getCurrent();
                this.addField(fieldName);
            }
        },
        _sync: function () {
            var $t;
            if (!this.entity.getHandledLocally()) {
                return;
            }
            var O = this.entity;
            var D = {  };
            var L = new (System.Collections.Generic.List$1(Object))();
            var ok = false;
            $t = Bridge.getEnumerator(this.fields);
            while ($t.moveNext()) {
                var field = $t.getCurrent();
                //D[field] = O[field];
                var val = this.getField(field);
                D[field] = val;
                L.add(val);
                if (this.lFields == null || (this.lFields.getCount() < L.getCount() || !Bridge.referenceEquals(this.lFields.getItem(((L.getCount() - 1) | 0)), L.getItem(((L.getCount() - 1) | 0))))) {
                    ok = true;
                }
            }
            var i = 0;

            if (ok) {
                this.sendCustomEvent(D);
                this.lFields = L;
                if (this.forcesFlush) {
                    this.entity.game.netPlayNeedsFlush = true;
                }
            }

        },
        getField: function (fieldName) {
            var O = this.entity;
            if (O[fieldName]) {
                return O[fieldName];
            }
            if (O[System.String.concat("get", fieldName)]) {
                return O[System.String.concat("get", fieldName)]();
            }
            console.log(System.String.concat(System.String.concat(System.String.concat(System.String.concat("NetworkSync: Field \"", fieldName), "\" was not in "), Bridge.Reflection.getTypeFullName(Bridge.getType(this.entity))), "."));
            //throw new Exception("NetworkSync: Field \"" + fieldName + "\" was not found.");
            return null;
        },
        setField: function (fieldName, data) {
            var O = this.entity;
            if (O[fieldName]) {
                O[fieldName] = data;
                return;
            }
            if (O[System.String.concat("set", fieldName)]) {
                O[System.String.concat("set", fieldName)](data);
                return;
            }
            //throw new Exception("NetworkSync: Field \"" + fieldName + "\" was not found.");
            console.log(System.String.concat(System.String.concat(System.String.concat(System.String.concat("NetworkSync: Field \"", fieldName), "\" was not in "), Bridge.Reflection.getTypeFullName(Bridge.getType(this.entity))), "."));
        },
        sync: function () {
            this.needsSync = true;
        },
        customEvent: function (evt) {
            if (this.entity.getHandledLocally()) {
                return;
            }
            var O = this.entity;
            /* foreach (string field in evt)
                {
                    SetField(field, evt[field]);
                }*/
            for (var field in evt){this.setField(field,evt[field]);};
            if (this.updateOnSync) {
                this.entity.update();
            }
            //base.CustomEvent(evt);
        },
        update: function () {
            if (this.updating) {
                return;
            }
            this.updating = true;
            if (this.automaticSyncInterval > 0) {
                this.timer = (this.timer + 1) | 0;
                if (this.timer > this.automaticSyncInterval) {
                    this.needsSync = true;
                    this.timer = 0;
                }
            }
            if (this.needsSync) {
                this._sync();
                this.needsSync = false;
            }
            this.updating = false;
            //base.Update();
        }
    });

    Bridge.define("BNTest.Orb", {
        inherits: [BNTest.Entity],
        ready: false,
        started: false,
        entity: null,
        coinsToRelease: 0,
        ctor: function (world, entity) {
            this.$initialize();
            BNTest.Entity.ctor.call(this, world);
            this.game = world.game;
            this.model = new BNTest.Model(this.game);
            this.entity = entity;
            var smooth = this.game.smooth;
            this.solid = false;
            this.customBoundingBox = new BNTest.BoundingBox.$ctor2(20);
            this.customBoundingBox.min.y = -2;
            this.lastBB = this.customBoundingBox.clone();
            var mdl = "orb";
            var tmdl = BNTest.ModelCache.get_this().get(mdl, false);
            if (tmdl != null) {
                console.log(System.String.concat(System.String.concat("loading \"", mdl), "\" model from cache."));
                //model.CopyFrom(tmdl);
                this.model.copyFrom(tmdl, true);
                this.ready = true;
            } else {
                BNTest.AnimationLoader.get_this().asyncGet$1(["object/orb"], Bridge.fn.bind(this, function () {
                    if (tmdl != null) {
                        console.log(System.String.concat(System.String.concat("loading \"", mdl), "\" model from cache."));
                        //model.CopyFrom(tmdl);
                        this.model.copyFrom(tmdl, true);
                        this.ready = true;
                        return;
                    }
                    if (this.model != null) {
                        this.model.unloadBuffers();
                        world.remove$1(this.model);
                    }
                    this.visible = false;
                    //model.Clear();
                    //HP = maxHP = defaultMaxHP;
                    world.add$1(this.model);

                    var alpha = 0.36;

                    var pal = new (System.Collections.Generic.Dictionary$2(BNTest.GLColor,BNTest.GLColor))();
                    pal.set(new BNTest.GLColor(1, 1, 1), new BNTest.GLColor(1, 1, 1, 0.36));

                    var box = this.game.getVoxelCombo(["object/orb"]);
                    box.applyPalette(pal);
                    //body.ApplyPalette(pal);
                    var md = new BNTest.Model(this.game);
                    var M = new BNTest.Mesh(this.game);
                    md.scale = BNTest.GLVec3.createUniform(0.6);
                    M.addVoxelMap(box, smooth);
                    md.meshes.add(M.clone());
                    //md.BleedThrough = true;
                    this.model.children.add(md);


                    box = this.game.getVoxelCombo(["object/orb"]);
                    //pal[new GLColor(1, 1, 1)] = new GLColor(1, 1, 1, 0.12);
                    pal.set(new BNTest.GLColor(1, 1, 1), new BNTest.GLColor(1, 1, 1, alpha * 0.4));
                    box.applyPalette(pal);


                    md = new BNTest.Model(this.game);
                    M = new BNTest.Mesh(this.game);
                    M.addVoxelMap(box, smooth);
                    md.scale = BNTest.GLVec3.createUniform(1);
                    md.meshes.add(M);
                    //md.alpha = 0.5f;
                    //model.children.Add(md);

                    //M.AddVoxelMap(box, smooth);
                    this.model.children.add(md);
                    this.model.scale = BNTest.GLVec3.createUniform(1.5);
                    this.model.smoothen();
                    this.ready = true;
                    //CacheBoundingBox();
                    if (tmdl == null) {
                        BNTest.ModelCache.get_this().set$1(mdl, this.model);
                    }
                }));
            }
        },
        update: function () {
            if (this.lastBB == null) {
                this.lastBB = new BNTest.BoundingBox.ctor();
            }
            if (this.ready && !this.started && this.entity != null) {
                this.started = true;
                this.setPosition(this.entity.getPosition().clone());
            }
            this.world.bringToFront(this.model);
            //var f = MathHelper.Clamp(model.Scale.X * (1+(-0.1 + (0.2 * Math.Random()))),1.0,2.0);
            var f = BNTest.MathHelper.clamp(this.model.scale.x * (1 + (-0.1 + (0.2 * Math.random()))), 1.1, 1.9);
            this.model.scale = BNTest.GLVec3.createUniform(f);
            this.model.rotation.y = this.entity.model.rotation.y;
            if (this.entity != null) {
                this.visible = this.entity.visible;
                var off = new BNTest.Vector2(10, 0).rotate(BNTest.MathHelper.degreesToRadians(this.entity.model.rotation.y) - 0.6);

                var P = BNTest.GLVec3.op_Addition$1(this.entity.getPosition().clone(), off);
                P.y -= 5;
                var rel = BNTest.GLVec3.op_Subtraction(P, this.getPosition());
                var spd = 1.5;
                var rl = rel.getLength();
                spd += rl * 0.03;
                if (rl <= spd) {
                    this.model.offset = P.clone();
                } else {
                    this.model.offset = BNTest.GLVec3.op_Addition(this.model.offset, rel.normalize(spd));
                }
                this.alive = this.entity.alive;
                if (this.alive) {
                    if (!this.world.entities.contains(this.entity)) {
                        this.alive = false;
                    }
                }
                this.visible = this.entity.visible;
            } else {
                this.alive = false;
            }


            BNTest.Entity.prototype.update.call(this);
        },
        draw: function (gl) {
            BNTest.Entity.prototype.draw.call(this, gl);
        }
    });

    Bridge.define("BNTest.PlatformerControls", {
        inherits: [BNTest.EntityBehavior],
        _platformer: null,
        accel: 0.35,
        jumpSpeed: 3.0,
        maxSpeed: 1.9,
        ctor: function (entity) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);
            this._platformer = entity;
        },
        update: function () {
            var controller = this._platformer.controller;
            var acc = this.accel;
            var Floor = this._platformer.floor;

            var fric = this._platformer.friction;
            //acc += fric;
            if (Floor != null) {
                var f = Floor.groundFriction;
                acc *= f;
            }
            if (controller[0] && this._platformer.getHspeed() > -this.maxSpeed) {
                this._platformer.setHspeed(Math.max(this._platformer.getHspeed() - (acc), -this.maxSpeed));
            }
            if (controller[1] && this._platformer.getHspeed() < this.maxSpeed) {
                this._platformer.setHspeed(Math.min(this._platformer.getHspeed() + (acc), this.maxSpeed));
            }
            if (controller[2] && this._platformer.getZspeed() > -this.maxSpeed) {
                this._platformer.setZspeed(Math.max(this._platformer.getZspeed() - (acc), -this.maxSpeed));
            }
            if (controller[3] && this._platformer.getZspeed() < this.maxSpeed) {
                this._platformer.setZspeed(Math.min(this._platformer.getZspeed() + (acc), this.maxSpeed));
            }
            if (this._platformer.getVspeed() >= 0 && this._platformer.onGround) {
                if (controller[4] && this._platformer.ceiling == null) {
                    this._platformer.setVspeed(-this.jumpSpeed);
                    this._platformer.playSound("jump");
                }
                /* if (controller[2] && _platformer.Ceiling == null)
                    {
                        _platformer.Vspeed = -jumpSpeed;
                        entity.PlaySound("jump");
                    }
                    else if (controller[3] && _platformer.Floor != null)
                    {
                        //platformer.y = groundY + 2;
                        _platformer.onGround = false;
                        _platformer.Floor = null;
                        _platformer.y += 2;
                    }*/
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        }
    });

    Bridge.define("BNTest.Projectile", {
        inherits: [BNTest.Entity,BNTest.IHarmfulEntity],
        _Attacker: null,
        _IsHarmful: true,
        _touchDamage: 1,
        knockbackPower: 1,
        gravity: null,
        bounces: false,
        ifriction: 1,
        rotationSpeed: null,
        multiHit: false,
        damaged: null,
        config: {
            alias: [
            "getAttacker", "BNTest$IHarmfulEntity$getAttacker",
            "getIsHarmful", "BNTest$IHarmfulEntity$getIsHarmful",
            "gettouchDamage", "BNTest$IHarmfulEntity$gettouchDamage",
            "settouchDamage", "BNTest$IHarmfulEntity$settouchDamage",
            "ontouchDamage", "BNTest$IHarmfulEntity$ontouchDamage"
            ],
            init: function () {
                this.damaged = new (System.Collections.Generic.List$1(BNTest.ICombatant))();
            }
        },
        ctor: function (world, shooter) {
            this.$initialize();
            BNTest.Entity.ctor.call(this, world);
            this._Attacker = shooter;
        },
        getAttacker: function () {
            return this._Attacker;
        },
        getIsHarmful: function () {
            return this._IsHarmful;
        },
        gettouchDamage: function () {
            return this._touchDamage;
        },
        settouchDamage: function (value) {
            this._touchDamage = value;
        },
        clone: function () {
            var P = new BNTest.Projectile(this.world, this.getAttacker());
            P.model = this.model.clone();
            P.setPosition(this.getPosition().clone());
            P.speed = this.speed.clone();
            P.knockbackPower = this.knockbackPower;
            P.ifriction = this.ifriction;
            P.rotationSpeed = this.rotationSpeed;
            P.model.rotation = this.model.rotation;
            P.multiHit = this.multiHit;
            P.obstruction = this.obstruction;
            P.bounces = this.bounces;
            P.gravity = this.gravity;
            P.solid = this.solid;
            P.settouchDamage(this.gettouchDamage());
            var T = this.getBehavior(BNTest.LifeSpan);
            if (T != null) {
                P.addBehavior(new BNTest.LifeSpan(P, T.HP, T.flickerTime));
            }
            return P;
        },
        update: function () {
            if (this.lastBB == null) {
                this.lastBB = this.getBoundingBox();
            }
            if (this.lastBB == null) {
                BNTest.Entity.prototype.update.call(this);
                return;
            }
            var LBS = this.lastBB.getSize();
            if (this.lastBB != null && LBS.getRoughLength() > 0) {
                if (this.gravity != null) {
                    this.speed = BNTest.GLVec3.op_Addition(this.speed, this.gravity);
                }
                if (this.ifriction < 1) {
                    this.speed.x *= this.ifriction;
                    this.speed.y *= this.ifriction;
                }
                if (this.rotationSpeed != null) {
                    var R = this.model.rotation;
                    R.x += this.rotationSpeed.x;
                    R.y += this.rotationSpeed.y;
                    R.z += this.rotationSpeed.z;
                }
                var HS = BNTest.GLVec3.op_Multiply$1(this.speed, 0.5);
                var C = this.lastBB.getCenter();
                if (!this.bounces) {
                    var Solids = System.Linq.Enumerable.from(this.game.world.findObstructionCollision$1(BNTest.GLVec3.op_Addition(C, (BNTest.GLVec3.op_Addition(this.speed, HS))), this)).where($_.BNTest.Projectile.f1).toList(BNTest.Entity);

                    Solids.addRange(System.Linq.Enumerable.from(this.game.world.findObstructionCollision$1(C, this)).where($_.BNTest.Projectile.f1));
                    if (Solids.getCount() > 0) {
                        this.alive = false;
                    }
                } else {
                    //using obstruction collision on multiple obstruction projectiles can lead to janky physics, so i switched back to just solid
                    var SY = LBS.y;
                    var Solids1;
                    Solids1 = System.Linq.Enumerable.from(this.game.world.findSolidCollision(BNTest.BoundingBox.op_Addition(this.lastBB, (new BNTest.GLVec3.ctor(this.speed.x, 0, this.speed.z))), this)).where(function (E) {
                        return (E.onKill == null) && E.lastBB.getSize().y > SY;
                    }).toList(BNTest.Entity);
                    if (Solids1.getCount() > 0) {
                        this.speed.x *= -0.9;
                        this.speed.z *= -0.9;
                    }

                    var Y = this.gety();
                    var D = Bridge.compare((0.0), this.speed.y);
                    Solids1 = System.Linq.Enumerable.from(this.game.world.findSolidCollision(BNTest.BoundingBox.op_Addition(this.lastBB, (new BNTest.GLVec3.ctor(0, this.speed.y, 0))), this)).where(Bridge.fn.bind(this, function (E) {
                        return (E.onKill == null) && Bridge.compare(this.gety(), E.gety()) === D;
                    })).toList(BNTest.Entity);
                    if (Solids1.getCount() > 0) {
                        this.model.offset.y -= this.speed.y;
                        this.speed.y *= -0.9;

                    }
                }

            }
            BNTest.Entity.prototype.update.call(this);
        },
        ontouchDamage: function (target) {
            var ret = !this.damaged.contains(target);
            if (ret) {
                this.damaged.add(target);
            }
            return ret;
            //throw new NotImplementedException();
        }
    });

    Bridge.ns("BNTest.Projectile", $_);

    Bridge.apply($_.BNTest.Projectile, {
        f1: function (E) {
            return (E.onKill == null);
        }
    });

    Bridge.define("BNTest.ProximityAttacker", {
        inherits: [BNTest.EntityBehavior],
        target: null,
        sightRange: 400,
        aggroRange: 400,
        predict: true,
        /**
         * If true, this behavior will not be active if the entity's HP is 100 or more.
         *
         * @instance
         * @public
         * @memberof BNTest.ProximityAttacker
         * @default false
         * @type boolean
         */
        passive: false,
        aggroFrames: 2,
        ignore: null,
        retaliates: true,
        config: {
            init: function () {
                this.ignore = new (System.Collections.Generic.List$1(BNTest.Entity))();
            }
        },
        ctor: function (entity) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);
        },
        onAttacked: function (source) {
            var E = source.BNTest$IHarmfulEntity$getAttacker();
            if (this.retaliates && !Bridge.referenceEquals(E, this.entity)) {
                this.target = E;
            }
        },
        update: function () {
            var controller = this.entity.controller;
            var N = this.entity.getBehavior(BNTest.NavigatorAI);
            var T2 = this.entity.getBehavior(BNTest.IWeaponBehavior);
            /* NavigatorAI N = entity.GetBehavior<NavigatorAI>();
                if (N == null)
                {
                    N = new NavigatorAI((ControllableEntity)entity);
                    N.FramesPerTick = FramesPerTick / 3;
                    entity.AddBehavior(N);
                }*/
            /* if (passive && entity.As<PlayerCharacter>().HP>=100)
                {
                    controller[5] = false;
                    return;
                }*/
            //if (N.MoveTo == null)
            {
                var P = this.entity.getPosition();
                if (this.target != null) {
                    if (P.roughDistance(this.target.model.offset) > this.sightRange) {
                        this.target = null;
                    }
                }
                if (this.target == null && !this.passive && (this.aggroFrames <= 1 || this.entity.game.frame % this.aggroFrames === 0)) {
                    var L = this.entity.world.entities;
                    var ln = L.getCount();
                    var i = 0;
                    while (i < ln) {
                        var E = L.getItem(i);
                        if (E.char) {
                            var EP = E;
                            if (!this.entity.sameTeam(EP) && !this.ignore.contains(E)) {
                                if (P.roughDistance(EP.model.offset) <= this.aggroRange) {
                                    this.target = EP;
                                    i = ln;
                                }
                            }
                        }
                        i = (i + 1) | 0;
                    }
                }
                var ok = true;
                if (this.entity.char != null) {
                    var PC = this.entity;
                    ok = !PC.manaburnout || T2._ammo > 0;
                    if (!ok) {
                        ok = PC.ammo + (PC.ammoRechargeRate * 60) > PC.maxAmmo;
                    }
                }
                if (this.target != null && ok) {
                    controller[5] = true;

                    var Pos = this.target.getPosition().clone();
                    if (this.predict) {
                        Pos = BNTest.GLVec3.op_Addition(Pos, BNTest.GLVec3.op_Multiply$1(this.target.speed, 30));
                    }
                    //N.RequestMoveTo(Pos, 0.5f);
                    var rel = BNTest.MathHelper.radiansToDegrees((BNTest.GLVec3.op_Subtraction(this.entity.getPosition(), Pos)).toVector2().toAngle());
                    this.entity.model.rotation.y = rel + 90;
                    N.setsAngle = false;
                    //var A = new Vector2()
                    //entity.model.Rotation.Y = 
                } else {
                    controller[5] = false;
                    N.setsAngle = true;
                }
                //N.MoveTo = Target.Position.Clone();

                /* double maxrange = 60;
                    double mr2 = maxrange + maxrange;
                    //GLVec3 V = new GLVec3(Math.Random()*maxrange, Math.Random() * maxrange, Math.Random() * maxrange) + entity.Position;
                    GLVec3 V = new GLVec3(-maxrange + (Math.Random() * mr2), 0, -maxrange + (Math.Random() * mr2)) + entity.Position;
                    N.RequestMoveTo(V, 0.4f);*/
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        }
    });

    Bridge.define("BNTest.RapidFireGun", {
        inherits: [BNTest.EntityBehavior,BNTest.IWeaponBehavior],
        _ammo: 0,
        _maxAmmo: 7,
        _shotDelay: 0,
        _maxShotDelay: 4,
        _angle: 0,
        bulletSpeed: 12,
        bulletLifeSpan: 35,
        bulletGraphic: null,
        minCoolDown: 20,
        config: {
            alias: [
            "getEnergyCost", "BNTest$IWeaponBehavior$getEnergyCost",
            "getMaxCooldown", "BNTest$IWeaponBehavior$getMaxCooldown",
            "setFiringAngle", "BNTest$IWeaponBehavior$setFiringAngle",
            "getWeaponType", "BNTest$IWeaponBehavior$getWeaponType",
            "fire", "BNTest$IWeaponBehavior$fire"
            ]
        },
        ctor: function (entity) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);
        },
        getEnergyCost: function () {
            return 3.5;
        },
        getMaxCooldown: function () {
            return (((this._maxAmmo * this._maxShotDelay) | 0)) + this.minCoolDown;
        },
        setFiringAngle: function (value) {
            this._angle = value;
        },
        getWeaponType: function () {
            return 1;
        },
        update: function () {
            if (this._ammo > 0) {
                this._shotDelay = (this._shotDelay - 1) | 0;
                if (this._shotDelay <= 0) {
                    this._shotDelay = this._maxShotDelay;
                    this._ammo = (this._ammo - 1) | 0;
                    if (this.entity.getHandledLocally()) {
                        var ang = BNTest.MathHelper.degreesToRadians(this._angle + 90);
                        var D = {  };
                        D.A = this._angle;

                        //float inaccuracy = 0.10f;
                        var inaccuracy = 0.13;
                        var V = BNTest.Vector2.fromRadian(-inaccuracy + (Math.random() * (inaccuracy + inaccuracy)) + ang);

                        var V1 = BNTest.Vector2.op_Multiply(V, this.bulletSpeed);
                        D.SX = V1.x;
                        D.SY = V1.y;
                        var P = BNTest.GLVec3.op_Addition$1(this.entity.getCenter(), (V));
                        D.X = P.x;
                        D.Y = P.y;
                        D.Z = P.z;

                        this.customEvent(D);
                    }

                }
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        },
        customEvent: function (evt) {
            this.entity.playSound("pew");

            var P = new BNTest.Projectile(this.entity.world, this.entity);
            P.solid = false;
            var M = new BNTest.Model(this.entity.game);
            M.meshes.add(this.bulletGraphic);
            P.model = M;

            //P.touchDamage = 7.5f;
            //P.touchDamage = 15f;
            //P.touchDamage = 35f;
            P.settouchDamage(50.0);

            P.speed = BNTest.GLVec3.op_Addition$1(new BNTest.GLVec3.ctor(), new BNTest.Vector2(evt.SX, evt.SY));
            //P.AddBehavior(new LifeSpan(P, 60));

            M.rotation.y = evt.A;

            var HSZ = new BNTest.GLVec3.ctor(7, 7, 7);
            M.customBoundingBox = new BNTest.BoundingBox.$ctor1(BNTest.GLVec3.op_Multiply$1(HSZ, -1), HSZ);
            P.customBoundingBox = M.customBoundingBox;

            P.setx(evt.X);
            P.sety(evt.Y + 2);
            P.setz(evt.Z);


            P.addBehavior(new BNTest.LifeSpan(P, this.bulletLifeSpan));
            this.entity.world.add(P);
        },
        fire: function (angle) {
            this._angle = angle;
            this._ammo = this._maxAmmo;
        }
    });

    Bridge.define("BNTest.RapidWideGun", {
        inherits: [BNTest.EntityBehavior,BNTest.IWeaponBehavior],
        _ammo: 0,
        _maxAmmo: 9,
        _shotDelay: 0,
        _maxShotDelay: 3,
        _angle: 0,
        bulletGraphic: null,
        config: {
            alias: [
            "getEnergyCost", "BNTest$IWeaponBehavior$getEnergyCost",
            "getMaxCooldown", "BNTest$IWeaponBehavior$getMaxCooldown",
            "setFiringAngle", "BNTest$IWeaponBehavior$setFiringAngle",
            "getWeaponType", "BNTest$IWeaponBehavior$getWeaponType",
            "fire", "BNTest$IWeaponBehavior$fire"
            ]
        },
        ctor: function (entity) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);
        },
        getEnergyCost: function () {
            return 2.5;
        },
        getMaxCooldown: function () {
            //return (_maxAmmo * _maxShotDelay) + 15;
            return (((((this._maxAmmo * this._maxShotDelay) | 0)) + 13) | 0);
        },
        setFiringAngle: function (value) {
            this._angle = value;
        },
        getWeaponType: function () {
            return 1;
        },
        update: function () {
            if (this._ammo > 0) {
                this._shotDelay = (this._shotDelay - 1) | 0;
                if (this._shotDelay <= 0) {
                    this._shotDelay = this._maxShotDelay;
                    this._ammo = (this._ammo - 1) | 0;
                    if (this.entity.getHandledLocally()) {
                        var ang = BNTest.MathHelper.degreesToRadians(this._angle + 90);
                        var D = {  };
                        D.A = this._angle;

                        var inaccuracy = 0.6;
                        var V = BNTest.Vector2.fromRadian(-inaccuracy + (Math.random() * (inaccuracy + inaccuracy)) + ang);
                        //V = V.Normalize(18);
                        //V *= 18;
                        var V1 = BNTest.Vector2.op_Multiply(V, 9);
                        D.SX = V1.x;
                        D.SY = V1.y;
                        var P = BNTest.GLVec3.op_Addition$1(this.entity.getCenter(), (BNTest.Vector2.op_Multiply(V, 15)));
                        D.X = P.x;
                        D.Y = P.y;
                        D.Z = P.z;
                        //SendCustomEvent(D, true);
                        this.customEvent(D);
                    }

                }
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        },
        customEvent: function (evt) {
            this.entity.playSound("pew");

            var P = new BNTest.Projectile(this.entity.world, this.entity);
            P.solid = false;
            var M = new BNTest.Model(this.entity.game);
            M.meshes.add(this.bulletGraphic);
            P.model = M;

            P.settouchDamage(8);

            P.speed = BNTest.GLVec3.op_Addition$1(new BNTest.GLVec3.ctor(), new BNTest.Vector2(evt.SX, evt.SY));
            P.addBehavior(new BNTest.LifeSpan(P, 60));

            M.rotation.y = evt.A;

            var HSZ = new BNTest.GLVec3.ctor(7, 7, 7);
            M.customBoundingBox = new BNTest.BoundingBox.$ctor1(BNTest.GLVec3.op_Multiply$1(HSZ, -1), HSZ);


            //P.x = entity.x;
            P.sety(this.entity.gety() + 2);
            //P.z = entity.z;

            P.setx(evt.X);
            P.sety(evt.Y);
            P.setz(evt.Z);


            //P.Position += P.Speed * 2;
            P.addBehavior(new BNTest.LifeSpan(P, 14));
            this.entity.world.add(P);
        },
        fire: function (angle) {
            this._angle = angle;
            this._ammo = this._maxAmmo;
        }
    });

    Bridge.define("BNTest.RingShot", {
        inherits: [BNTest.EntityBehavior,BNTest.IWeaponBehavior],
        _ammo: 0,
        _maxAmmo: 1,
        _shotDelay: 0,
        _maxShotDelay: 4,
        _angle: 0,
        bulletSpeed: 2.0,
        bulletLifeSpan: 130,
        bulletGraphic: null,
        minCoolDown: 100,
        config: {
            alias: [
            "getEnergyCost", "BNTest$IWeaponBehavior$getEnergyCost",
            "getMaxCooldown", "BNTest$IWeaponBehavior$getMaxCooldown",
            "setFiringAngle", "BNTest$IWeaponBehavior$setFiringAngle",
            "getWeaponType", "BNTest$IWeaponBehavior$getWeaponType",
            "fire", "BNTest$IWeaponBehavior$fire"
            ]
        },
        ctor: function (entity) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);
        },
        getEnergyCost: function () {
            return 3.5;
        },
        getMaxCooldown: function () {
            return (((this._maxAmmo * this._maxShotDelay) | 0)) + this.minCoolDown;
        },
        setFiringAngle: function (value) {
            this._angle = value;
        },
        getWeaponType: function () {
            return 1;
        },
        update: function () {
            if (this._ammo > 0) {
                this._shotDelay = (this._shotDelay - 1) | 0;
                if (this._shotDelay <= 0) {
                    this._shotDelay = this._maxShotDelay;
                    this._ammo = (this._ammo - 1) | 0;
                    if (this.entity.getHandledLocally()) {
                        var ang = BNTest.MathHelper.degreesToRadians(this._angle + 90);
                        var D = {  };
                        D.A = this._angle;

                        //float inaccuracy = 0.10f;
                        //float inaccuracy = 0.13f;
                        var inaccuracy = 0;
                        var V = BNTest.Vector2.fromRadian(-inaccuracy + (Math.random() * (inaccuracy + inaccuracy)) + ang);

                        var V1 = BNTest.Vector2.op_Multiply(V, this.bulletSpeed);
                        D.SX = V1.x;
                        D.SY = V1.y;
                        var P = BNTest.GLVec3.op_Addition$1(this.entity.getCenter(), (V));
                        D.X = P.x;
                        D.Y = P.y;
                        D.Z = P.z;

                        this.customEvent(D);
                    }

                }
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        },
        customEvent: function (evt) {
            this.entity.playSound("pew");

            /* var P = new Projectile(entity.world, entity);
                P.Solid = false;
                var M = new Model(entity.Game);
                M.meshes.Add(BulletGraphic);
                P.model = M;

                P.touchDamage = 50f;*/

            var spd = new BNTest.Vector2(evt.SX, evt.SY);
            var HSZ = new BNTest.GLVec3.ctor(7, 7, 7);
            /* P.Speed = new GLVec3() + spd;*/
            //P.AddBehavior(new LifeSpan(P, 60));

            /* M.Rotation.Y = evt.A;

            
                M.CustomBoundingBox = new BoundingBox(HSZ * -1, HSZ);
                P.CustomBoundingBox = M.CustomBoundingBox;

                P.x = evt.X;
                P.y = evt.Y + 2;
                P.z = evt.Z;


                P.AddBehavior(new LifeSpan(P, bulletLifeSpan));
                entity.world.Add(P);*/
            var i = 0;
            var ang = 0.20933333333333334;
            while (i < 6.28) {
                var P = new BNTest.Projectile(this.entity.world, this.entity);
                P.solid = false;
                var M = new BNTest.Model(this.entity.game);
                M.meshes.add(this.bulletGraphic);
                P.model = M;

                P.settouchDamage(60.0);

                P.speed = BNTest.GLVec3.op_Addition$1(new BNTest.GLVec3.ctor(), spd.rotate(i));
                //P.Speed = GLVec3.TransformB(spd,);
                //P.AddBehavior(new LifeSpan(P, 60));

                M.rotation.y = evt.A + BNTest.MathHelper.radiansToDegrees(i);

                M.customBoundingBox = new BNTest.BoundingBox.$ctor1(BNTest.GLVec3.op_Multiply$1(HSZ, -1), HSZ);
                P.customBoundingBox = M.customBoundingBox;

                P.setx(evt.X);
                P.sety(evt.Y + 2);
                P.setz(evt.Z);


                P.addBehavior(new BNTest.LifeSpan(P, this.bulletLifeSpan));
                this.entity.world.add(P);
                i += ang;
            }
        },
        fire: function (angle) {
            this._angle = angle;
            this._ammo = this._maxAmmo;
        }
    });

    Bridge.define("BNTest.Rock", {
        inherits: [BNTest.Entity],
        size: 18,
        ctor: function (world) {
            this.$initialize();
            BNTest.Entity.ctor.call(this, world);
            this.game = world.game;
            this.model = new BNTest.Model(this.game);
            var smooth = this.game.smooth;


            this.solid = true;
            //var size = 30;
            //var size = 80;
            var Char = "rock";
            var tmdl = BNTest.ModelCache.get_this().get(Char, false);
            var M = null;
            var size = 30;

            if (tmdl != null) {
                console.log(System.String.concat(System.String.concat("loading \"", Char), "\" model from cache."));

                M = tmdl.meshes.getItem(0).clone();
                this.model.meshes.add(M);
            } else {
                var VM = BNTest.VoxelMap.generateRock(size, BNTest.GLColor.createShade(0.75), 0.9);
                VM.addNoise(0.07);

                M = new BNTest.Mesh(this.game);

                M.addVoxelMap(VM, smooth);
                this.model.meshes.add(M);
                BNTest.ModelCache.get_this().set$1(Char, this.model);
            }

            //CacheBoundingBox();

            this.model.rotation.y = Math.random() * 360;
            this.model.scale = BNTest.GLVec3.createUniform(0.7 + (Math.random() * 0.65));


            //CacheBoundingBox();
            this.customBoundingBox = new BNTest.BoundingBox.$ctor2(size);
            this.customBoundingBox = BNTest.BoundingBox.op_Multiply(this.customBoundingBox, this.model.scale);
            this.customBoundingBox = BNTest.BoundingBox.op_Subtraction(this.customBoundingBox, BNTest.GLVec3.op_Multiply$1(this.customBoundingBox.getSize(), 0.5));


            //model.Offset.Y = -(size);
            //model.Offset.Y -= CustomBoundingBox.Max.Y;
        },
        update: function () {
            BNTest.Entity.prototype.update.call(this);
            //Position.Y = -(CustomBoundingBox.Max.Y);
            //Position.Y = (CustomBoundingBox.Min.Y);
            this.getPosition().y = (((-(((Bridge.Int.div(this.size, 2)) | 0))) | 0) + 10) | 0;
        },
        draw: function (gl) {
            BNTest.Entity.prototype.draw.call(this, gl);
        }
    });

    Bridge.define("BNTest.SecondaryResponder", {
        inherits: [BNTest.EntityBehavior],
        attemptTime: 0,
        time: 0,
        ctor: function (entity, attemptTime) {
            if (attemptTime === void 0) { attemptTime = 30; }

            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);
            this.attemptTime = attemptTime;
        },
        onAttacked: function (source) {
            var E = this.entity;
            E.controller[6] = true;
            this.time = this.attemptTime;
        },
        update: function () {
            if (this.time > 0) {
                this.time = (this.time - 1) | 0;
            } else {
                var E = this.entity;
                E.controller[6] = false;
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        }
    });

    Bridge.define("BNTest.SpawnIllusions", {
        inherits: [BNTest.EntityBehavior,BNTest.IWeaponBehavior],
        _ammo: 0,
        _maxAmmo: 1,
        _shotDelay: 0,
        _maxShotDelay: 4,
        _angle: 0,
        bulletSpeed: 12,
        bulletLifeSpan: 35,
        bulletGraphic: null,
        minCoolDown: 240,
        config: {
            alias: [
            "getEnergyCost", "BNTest$IWeaponBehavior$getEnergyCost",
            "getMaxCooldown", "BNTest$IWeaponBehavior$getMaxCooldown",
            "setFiringAngle", "BNTest$IWeaponBehavior$setFiringAngle",
            "getWeaponType", "BNTest$IWeaponBehavior$getWeaponType",
            "fire", "BNTest$IWeaponBehavior$fire"
            ]
        },
        ctor: function (entity) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);
        },
        getEnergyCost: function () {
            return 3.5;
        },
        getMaxCooldown: function () {
            return (((this._maxAmmo * this._maxShotDelay) | 0)) + this.minCoolDown;
        },
        setFiringAngle: function (value) {
            this._angle = value;
        },
        getWeaponType: function () {
            return 2;
        },
        update: function () {
            if (this._ammo > 0) {
                this._shotDelay = (this._shotDelay - 1) | 0;
                if (this._shotDelay <= 0) {
                    this._shotDelay = this._maxShotDelay;
                    this._ammo = (this._ammo - 1) | 0;
                    if (this.entity.getHandledLocally()) {
                        //var ang = MathHelper.DegreesToRadians(_angle + 90);
                        var D = {  };
                        var S = System.Array.init(0, null);
                        /* D.A = _angle;

                            //float inaccuracy = 0.10f;
                            float inaccuracy = 0.13f;
                            Vector2 V = Vector2.FromRadian(-inaccuracy + ((float)Math.Random() * (inaccuracy + inaccuracy)) + ang);

                            Vector2 V1 = V * bulletSpeed;
                            D.SX = V1.X;
                            D.SY = V1.Y;
                            GLVec3 P = entity.getCenter() + (V);
                            D.X = P.X;
                            D.Y = P.Y;
                            D.Z = P.Z*/
                        var ms = 70;
                        var ms2 = ms + ms;
                        var O = this.entity.getPosition().clone();
                        var V = O.clone();
                        //int i = 5+1;
                        var i = 4;
                        while (i > 0) {
                            V.x = O.x + (-ms + (ms2 * Math.random()));
                            V.z = O.z + (-ms + (ms2 * Math.random()));
                            S.push(V.toVec3());
                            i = (i - 1) | 0;
                        }
                        D.S = S;


                        this.customEvent(D);
                    }

                }
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        },
        customEvent: function (evt) {
            this.entity.model.rotation.y = 6.28 * Math.random();

            var S = evt.S;
            this.entity.setPosition(new BNTest.GLVec3.$ctor1(S[0]));
            this.entity.model.alpha = 0.1;
            var i = 1;
            var ln = S.length;
            var EP = this.entity;
            while (i < ln) {
                var PC = new BNTest.PlayerCharacter(this.entity.world, new BNTest.Player(true, true, EP.me.minion), this.entity.char, this.entity.team);
                PC.setPosition(new BNTest.GLVec3.$ctor1(S[i]));
                PC.model.rotation.y = 6.28 * Math.random();
                PC.canShoot = false;
                //PC.HP = 100;
                PC.defense = EP.defense * 0.75;
                PC.knockbackResistLevel = EP.knockbackResistLevel;
                PC.canRespawn = false;
                PC.addBehavior(new BNTest.LifeSpan(PC, 900));
                PC.reward = false;
                PC.model.alpha = 0;
                this.entity.world.add(PC);
                i = (i + 1) | 0;
            }
            /* entity.PlaySound("pew");

                var P = new Projectile(entity.world, entity);
                P.Solid = false;
                var M = new Model(entity.Game);
                M.meshes.Add(BulletGraphic);
                P.model = M;

                P.touchDamage = 50f;

                P.Speed = new GLVec3() + new Vector2(evt.SX, evt.SY);
                //P.AddBehavior(new LifeSpan(P, 60));

                M.Rotation.Y = evt.A;

                GLVec3 HSZ = new GLVec3(7, 7, 7);
                M.CustomBoundingBox = new BoundingBox(HSZ * -1, HSZ);
                P.CustomBoundingBox = M.CustomBoundingBox;

                P.x = evt.X;
                P.y = evt.Y + 2;
                P.z = evt.Z;


                P.AddBehavior(new LifeSpan(P, bulletLifeSpan));
                entity.world.Add(P);*/
        },
        fire: function (angle) {
            this._angle = angle;
            this._ammo = this._maxAmmo;
        }
    });

    Bridge.define("BNTest.SwordSwing", {
        inherits: [BNTest.EntityBehavior,BNTest.IWeaponBehavior],
        _ammo: 0,
        _maxAmmo: 3,
        _shotDelay: 0,
        _maxShotDelay: 3,
        _angle: 0,
        bulletSpeed: 24,
        bulletGraphic: null,
        active: false,
        speed: null,
        forcedAngle: 0,
        minCoolDown: 45,
        config: {
            alias: [
            "getEnergyCost", "BNTest$IWeaponBehavior$getEnergyCost",
            "getMaxCooldown", "BNTest$IWeaponBehavior$getMaxCooldown",
            "setFiringAngle", "BNTest$IWeaponBehavior$setFiringAngle",
            "getWeaponType", "BNTest$IWeaponBehavior$getWeaponType",
            "fire", "BNTest$IWeaponBehavior$fire"
            ]
        },
        ctor: function (entity) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);
        },
        getEnergyCost: function () {
            return 3.5;
        },
        getMaxCooldown: function () {
            return (((this._maxAmmo * this._maxShotDelay) | 0)) + this.minCoolDown;
        },
        setFiringAngle: function (value) {
            this._angle = value;
        },
        getWeaponType: function () {
            return 2;
        },
        update: function () {
            if (this._ammo > 0) {
                if (this.active) {
                    this.entity.speed = this.speed.clone();
                }
                this._shotDelay = (this._shotDelay - 1) | 0;
                if (this._shotDelay <= 0) {
                    this._shotDelay = this._maxShotDelay;
                    this._ammo = (this._ammo - 1) | 0;
                    if (this.entity.getHandledLocally()) {
                        var ang = BNTest.MathHelper.degreesToRadians(this._angle + 90);
                        var D = {  };
                        D.A = this._angle;

                        //float inaccuracy = 0.10f;
                        var inaccuracy = 0.13;
                        var V = BNTest.Vector2.fromRadian(-inaccuracy + (Math.random() * (inaccuracy + inaccuracy)) + ang);

                        var V1 = BNTest.Vector2.op_Multiply(V, this.bulletSpeed);
                        D.SX = V1.x;
                        D.SY = V1.y;
                        var P = BNTest.GLVec3.op_Addition$1(this.entity.getCenter(), (V));
                        D.X = P.x;
                        D.Y = P.y;
                        D.Z = P.z;
                        this.entity.forcedAngle = this._angle;
                        this.entity.frictionActive = false;
                        if (!this.active) {
                            this.customEvent(D);
                        }
                    }

                }
            } else if (this.active) {
                this.entity.forcedAngle = null;
                this.entity.frictionActive = true;
                this.entity.speed = new BNTest.GLVec3.ctor();
                this.active = false;
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        },
        customEvent: function (evt) {
            this.entity.playSound("pew");

            var P = new BNTest.Projectile(this.entity.world, this.entity);
            P.solid = false;
            var M = new BNTest.Model(this.entity.game);
            M.meshes.add(this.bulletGraphic);
            P.model = M;

            //P.touchDamage = 7.5f;
            //P.touchDamage = 15f;
            //P.touchDamage = 35f;
            P.settouchDamage(50.0);

            P.speed = BNTest.GLVec3.op_Addition$1(new BNTest.GLVec3.ctor(), new BNTest.Vector2(evt.SX, evt.SY));
            //P.AddBehavior(new LifeSpan(P, 60));

            M.rotation.y = evt.A;

            var size = 30;
            var HSZ = new BNTest.GLVec3.ctor(size, size, size);
            M.customBoundingBox = new BNTest.BoundingBox.$ctor1(BNTest.GLVec3.op_Multiply$1(HSZ, -1), HSZ);
            P.customBoundingBox = M.customBoundingBox;

            P.setx(evt.X);
            P.sety(evt.Y + 2);
            P.setz(evt.Z);

            P.setScale(BNTest.GLVec3.createUniform(2));

            var lifespan = (this._maxShotDelay * this._maxAmmo) | 0;

            this.entity.invincibilityFrames = (this.entity.invincibilityFrames + lifespan) | 0;

            P.addBehavior(new BNTest.LifeSpan(P, lifespan));
            this.entity.world.add(P);

            this.active = true;
            this.speed = P.speed.clone();
            this.entity.speed = this.speed.clone();
            P.setPosition(BNTest.GLVec3.op_Addition(P.getPosition(), BNTest.GLVec3.op_Multiply$1(this.speed, 0.5)));

        },
        fire: function (angle) {
            this._angle = angle;
            this._ammo = this._maxAmmo;
        }
    });

    Bridge.define("BNTest.TextSprite", {
        inherits: [BNTest.Sprite],
        _Text: null,
        textInvallidated: false,
        imageInvallidated: false,
        textImage: null,
        textGraphic: null,
        _TextColor: null,
        _FontWeight: "normal",
        _FontFamily: "sans-serif",
        _FontSize: 10,
        _shadowBlur: 0.0,
        _shadowOffset: null,
        _shadowColor: "#000000",
        alpha: 1,
        config: {
            init: function () {
                this._shadowOffset = new BNTest.Vector2();
            }
        },
        ctor: function () {
            this.$initialize();
            BNTest.Sprite.ctor.call(this);
            this.textImage = document.createElement('canvas');
            this.textGraphic = this.textImage.getContext("2d");
            this.textGraphic.fillStyle = "#FFFFFF";
        },
        getText: function () {
            return this._Text;
        },
        setText: function (value) {
            if (!Bridge.referenceEquals(this._Text, value)) {
                this._Text = value;
                /* RedrawBaseTextImage();
                        RenderTextImage();*/
                this.textInvallidated = true;
                //imageInvallidated = true;
            }
        },
        getTextColor: function () {
            return this._TextColor;
        },
        setTextColor: function (value) {
            if (!Bridge.referenceEquals(this._TextColor, value)) {
                this._TextColor = value;
                //RenderTextImage();
                this.textInvallidated = true;

                //imageInvallidated = true;
            }
        },
        getFontWeight: function () {
            return this._FontWeight;
        },
        setFontWeight: function (value) {
            if (!Bridge.referenceEquals(this._FontWeight, value)) {
                this._FontWeight = value;
                this.updateFont();
            }
        },
        getFontFamily: function () {
            return this._FontFamily;
        },
        setFontFamily: function (value) {
            if (!Bridge.referenceEquals(this._FontFamily, value)) {
                this._FontFamily = value;
                this.updateFont();
            }
        },
        getFontSize: function () {
            return this._FontSize;
        },
        setFontSize: function (value) {
            if (this._FontSize !== value) {
                this._FontSize = value;
                this.updateFont();
            }
        },
        getShadowBlur: function () {
            return this._shadowBlur;
        },
        setShadowBlur: function (value) {
            if (this._shadowBlur !== value) {
                this._shadowBlur = value;
                this.imageInvallidated = true;
            }
        },
        getShadowOffset: function () {
            return this._shadowOffset.clone();
        },
        setShadowOffset: function (value) {
            if (BNTest.Vector2.op_Inequality(this._shadowOffset, value) && value.x !== this._shadowOffset.x && value.y !== this._shadowOffset.y) {
                this._shadowOffset = value.clone();
                this.imageInvallidated = true;
            }
        },
        getShadowColor: function () {
            return this._shadowColor;
        },
        setShadowColor: function (value) {
            if (!Bridge.referenceEquals(this._shadowColor, value)) {
                this._shadowColor = value;
                this.imageInvallidated = true;
            }
        },
        updateFont: function () {
            this.textGraphic.font = System.String.concat(System.String.concat(System.String.concat(System.String.concat(this._FontWeight, " "), this._FontSize), "px "), this._FontFamily);
            this.textInvallidated = true;
            this.imageInvallidated = true;
            this.textGraphic.fillStyle = this._TextColor;
        },
        redrawBaseTextImage: function () {
            this.updateFont();
            var lines = this._Text.split(String.fromCharCode(10));
            var H = this.getFontSize() * 1.0;


            var W = 0;
            var i = 0;
            while (i < lines.length) {
                var TM = this.textGraphic.measureText(lines[i]);
                W = Math.max(W, Bridge.Int.clip32(Math.ceil(TM.width)));
                i = (i + 1) | 0;
            }
            //TextImage.Height = (int)(H * (lines.Length+0.5f));
            this.textImage.height = Bridge.Int.clip32(H * (lines.length + 0.25));
            this.textImage.width = W;
            this.updateFont();

            var Y = 0;
            i = 0;
            while (i < lines.length) {
                this.textGraphic.fillText(lines[i], 0, (this.getFontSize() + Y));
                Y += H;
                i = (i + 1) | 0;
            }

            this.textInvallidated = false;
            this.imageInvallidated = true;
        },
        renderTextImage: function () {

            if (this._shadowBlur <= 0) {
                this.spriteBuffer.width = this.textImage.width;
                this.spriteBuffer.height = this.textImage.height;
            } else {
                var S = Bridge.Int.clip32(Math.ceil(this._shadowBlur + this._shadowBlur));
                this.spriteBuffer.width = (this.textImage.width + S) | 0;
                this.spriteBuffer.height = (this.textImage.height + S) | 0;
            }
            this.spriteGraphics.shadowBlur = 0;

            this.spriteGraphics.globalCompositeOperation = "source-over";
            /* spriteGraphics.FillStyle = _TextColor;
                spriteGraphics.FillRect(0, 0, spriteBuffer.Width, spriteBuffer.Height);
                Script.Write("this.spriteGraphics.globalCompositeOperation = 'destination-in'");*/
            if (this._shadowBlur <= 0) {
                this.spriteGraphics.drawImage(this.textImage, 0.0, 0.0);
            } else {
                this.spriteGraphics.drawImage(this.textImage, this._shadowBlur, this._shadowBlur);
            }

            if (this._shadowBlur > 0) {
                this.spriteGraphics.shadowBlur = this._shadowBlur;
                this.spriteGraphics.shadowColor = this._shadowColor;
                this.spriteGraphics.shadowOffsetX = this._shadowOffset.x;
                this.spriteGraphics.shadowOffsetY = this._shadowOffset.y;
                this.spriteGraphics.drawImage(this.spriteBuffer, 0.0, 0.0);
            }



            this.imageInvallidated = false;
        },
        draw: function (g) {
            if (this.textInvallidated) {
                this.redrawBaseTextImage();
            }
            if (this.imageInvallidated) {
                this.renderTextImage();
            }
            if (this.alpha >= 1) {
                BNTest.Sprite.prototype.draw.call(this, g);
            } else {
                var A = g.globalAlpha;
                g.globalAlpha = this.alpha;
                BNTest.Sprite.prototype.draw.call(this, g);
                g.globalAlpha = A;
            }
        }
    });

    Bridge.define("BNTest.Tree", {
        inherits: [BNTest.Entity],
        size: 90,
        ctor: function (world) {
            this.$initialize();
            BNTest.Entity.ctor.call(this, world);
            this.game = world.game;
            this.model = new BNTest.Model(this.game);
            var smooth = this.game.smooth;
            this.solid = true;

            var brightness = 0.65;
            //double yellowness = 0.5;
            var yellowness = 0.65;
            var Char = "tree";

            var tmdl = BNTest.ModelCache.get_this().get(Char, false);

            if (tmdl != null) {
                console.log(System.String.concat(System.String.concat("loading \"", Char), "\" model from cache."));
                this.model.copyFrom(tmdl);
            } else {
                var VM = BNTest.VoxelMap.generateTree(this.size, new BNTest.GLColor(brightness, brightness * yellowness, 0), 1);
                VM.addNoise(0.03);
                VM.addStripes(0.075, 1, 8);

                var M = new BNTest.Mesh(this.game);

                M.addVoxelMap(VM, smooth);
                this.model.meshes.add(M);
                this.model.scale = BNTest.GLVec3.op_Multiply$1(this.model.scale, 3);
                if (tmdl == null) {
                    BNTest.ModelCache.get_this().set$1(Char, this.model);
                }
            }
            this.model.rotation.y = 360 * Math.random();
            this.setScale(BNTest.GLVec3.op_Multiply$1(this.getScale(), (0.8 + (Math.random() * 0.4))));
            this.getPosition().y = -(this.size * this.model.scale.x * 0.5) + 10;
            this.cacheBoundingBox();

        },
        update: function () {
            BNTest.Entity.prototype.update.call(this);
            //Position.Y = -(CustomBoundingBox.Max.Y);
            //Position.Y = (CustomBoundingBox.Min.Y);
            this.getPosition().y = -(this.size * this.model.scale.x * 0.5) + 10;
        },
        draw: function (gl) {
            BNTest.Entity.prototype.draw.call(this, gl);
        }
    });

    Bridge.define("BNTest.WanderAI", {
        inherits: [BNTest.EntityBehavior],
        chance: 1,
        range: 60,
        ctor: function (entity) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);

        },
        update: function () {
            if (this.chance < 1 && this.chance < Math.random()) {
                return;
            }
            var N = this.entity.getBehavior(BNTest.NavigatorAI);
            if (N == null) {
                N = new BNTest.NavigatorAI(this.entity);
                N.framesPerTick = (Bridge.Int.div(this.framesPerTick, 3)) | 0;
                this.entity.addBehavior(N);
            }
            if (N.getMoveTo() == null) {
                /* float wanderRange = 1200;
                    float X = wanderRange;

                    if (RandomDirection)
                    {
                        if (Math.Random() < 0.5)
                        {
                            X = -X;
                        }
                    }
                    else
                    {
                        if (entity.Ani.Flipped)
                        {
                            X = -wanderRange;
                        }
                        if (Math.Random() < 0.05)
                        {
                            X = -X;
                        }
                    }
                    X *= (float)Math.Random();

                    Vector2 V = entity.Position + new Vector2(X, 0);
                    Rectangle R = entity.Game.stageBounds;
                    if (!R.containsPoint(V))
                    {
                        if (R.containsPoint(entity.Position + new Vector2(-X, 0)))
                        {
                            V = entity.Position + new Vector2(-X, 0);
                        }
                    }
                    //N.MoveTo = V;
                    N.RequestMoveTo(V, 0.4f);*/

                var maxrange = this.range;
                var mr2 = maxrange + maxrange;
                //GLVec3 V = new GLVec3(Math.Random()*maxrange, Math.Random() * maxrange, Math.Random() * maxrange) + entity.Position;
                var V = BNTest.GLVec3.op_Addition(new BNTest.GLVec3.ctor(-maxrange + (Math.random() * mr2), 0, -maxrange + (Math.random() * mr2)), this.entity.getPosition());
                N.requestMoveTo(V, 0.4);
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        }
    });

    Bridge.define("BNTest.WideShot", {
        inherits: [BNTest.EntityBehavior,BNTest.IWeaponBehavior],
        _ammo: 0,
        _maxAmmo: 1,
        _shotDelay: 0,
        _maxShotDelay: 4,
        _angle: 0,
        bulletSpeed: 12,
        bulletLifeSpan: 35,
        bulletGraphic: null,
        minCoolDown: 50,
        config: {
            alias: [
            "getEnergyCost", "BNTest$IWeaponBehavior$getEnergyCost",
            "getMaxCooldown", "BNTest$IWeaponBehavior$getMaxCooldown",
            "setFiringAngle", "BNTest$IWeaponBehavior$setFiringAngle",
            "getWeaponType", "BNTest$IWeaponBehavior$getWeaponType",
            "fire", "BNTest$IWeaponBehavior$fire"
            ]
        },
        ctor: function (entity) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);
        },
        getEnergyCost: function () {
            return 3.5;
        },
        getMaxCooldown: function () {
            return (((this._maxAmmo * this._maxShotDelay) | 0)) + this.minCoolDown;
        },
        setFiringAngle: function (value) {
            this._angle = value;
        },
        getWeaponType: function () {
            return 1;
        },
        update: function () {
            if (this._ammo > 0) {
                this._shotDelay = (this._shotDelay - 1) | 0;
                if (this._shotDelay <= 0) {
                    this._shotDelay = this._maxShotDelay;
                    this._ammo = (this._ammo - 1) | 0;
                    if (this.entity.getHandledLocally()) {
                        var ang = BNTest.MathHelper.degreesToRadians(this._angle + 90);
                        var D = {  };
                        D.A = this._angle;

                        //float inaccuracy = 0.10f;
                        var inaccuracy = 0.13;
                        var V = BNTest.Vector2.fromRadian(-inaccuracy + (Math.random() * (inaccuracy + inaccuracy)) + ang);

                        var V1 = BNTest.Vector2.op_Multiply(V, this.bulletSpeed);
                        D.SX = V1.x;
                        D.SY = V1.y;
                        var P = BNTest.GLVec3.op_Addition$1(this.entity.getCenter(), (V));
                        D.X = P.x;
                        D.Y = P.y;
                        D.Z = P.z;

                        this.customEvent(D);
                    }

                }
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        },
        customEvent: function (evt) {
            this.entity.playSound("pew");

            var P = new BNTest.Projectile(this.entity.world, this.entity);
            P.solid = false;
            var M = new BNTest.Model(this.entity.game);
            M.meshes.add(this.bulletGraphic);
            P.model = M;

            //P.touchDamage = 7.5f;
            //P.touchDamage = 15f;
            //P.touchDamage = 35f;
            P.settouchDamage(35.0);

            var spd = new BNTest.Vector2(evt.SX, evt.SY);

            P.speed = BNTest.GLVec3.op_Addition$1(new BNTest.GLVec3.ctor(), spd);
            //P.AddBehavior(new LifeSpan(P, 60));

            M.rotation.y = evt.A;

            var HSZ = new BNTest.GLVec3.ctor(7, 7, 7);
            M.customBoundingBox = new BNTest.BoundingBox.$ctor1(BNTest.GLVec3.op_Multiply$1(HSZ, -1), HSZ);
            P.customBoundingBox = M.customBoundingBox;

            P.setx(evt.X);
            P.sety(evt.Y + 2);
            P.setz(evt.Z);


            P.addBehavior(new BNTest.LifeSpan(P, this.bulletLifeSpan));
            this.entity.world.add(P);

            var sep = spd.normalize(15);
            var up = sep.rotate(-2.35619);
            var down = sep.rotate(2.35619);
            var number = 2;
            var scale = 1;
            while (number > 0) {
                P = new BNTest.Projectile(this.entity.world, this.entity);
                P.solid = false;
                M = new BNTest.Model(this.entity.game);
                M.meshes.add(this.bulletGraphic);
                P.model = M;

                P.settouchDamage(35.0);


                P.speed = BNTest.GLVec3.op_Addition$1(new BNTest.GLVec3.ctor(), spd);

                M.rotation.y = evt.A;

                M.customBoundingBox = new BNTest.BoundingBox.$ctor1(BNTest.GLVec3.op_Multiply$1(HSZ, -1), HSZ);
                P.customBoundingBox = M.customBoundingBox;

                P.setx(evt.X + (up.x * scale));
                P.sety(evt.Y + 2);
                P.setz(evt.Z + (up.y * scale));


                P.addBehavior(new BNTest.LifeSpan(P, this.bulletLifeSpan));
                this.entity.world.add(P);
                //
                P = new BNTest.Projectile(this.entity.world, this.entity);
                P.solid = false;
                M = new BNTest.Model(this.entity.game);
                M.meshes.add(this.bulletGraphic);
                P.model = M;

                P.settouchDamage(35.0);


                P.speed = BNTest.GLVec3.op_Addition$1(new BNTest.GLVec3.ctor(), spd);

                M.rotation.y = evt.A;

                M.customBoundingBox = new BNTest.BoundingBox.$ctor1(BNTest.GLVec3.op_Multiply$1(HSZ, -1), HSZ);
                P.customBoundingBox = M.customBoundingBox;

                P.setx(evt.X + (down.x * scale));
                P.sety(evt.Y + 2);
                P.setz(evt.Z + (down.y * scale));


                P.addBehavior(new BNTest.LifeSpan(P, this.bulletLifeSpan));
                this.entity.world.add(P);
                number = (number - 1) | 0;
                scale = (scale + 1) | 0;
            }
        },
        fire: function (angle) {
            this._angle = angle;
            this._ammo = this._maxAmmo;
        }
    });

    Bridge.define("BNTest.YinYangOrbGun", {
        inherits: [BNTest.EntityBehavior,BNTest.IWeaponBehavior],
        _ammo: 0,
        _maxAmmo: 1,
        _shotDelay: 0,
        _maxShotDelay: 4,
        _angle: 0,
        bulletSpeed: 3.5,
        bulletLifeSpan: 160,
        bulletGraphic: null,
        minCoolDown: 100,
        config: {
            alias: [
            "getEnergyCost", "BNTest$IWeaponBehavior$getEnergyCost",
            "getMaxCooldown", "BNTest$IWeaponBehavior$getMaxCooldown",
            "setFiringAngle", "BNTest$IWeaponBehavior$setFiringAngle",
            "getWeaponType", "BNTest$IWeaponBehavior$getWeaponType",
            "fire", "BNTest$IWeaponBehavior$fire"
            ]
        },
        ctor: function (entity) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);
        },
        getEnergyCost: function () {
            return 3.5;
        },
        getMaxCooldown: function () {
            return (((this._maxAmmo * this._maxShotDelay) | 0)) + this.minCoolDown;
        },
        setFiringAngle: function (value) {
            this._angle = value;
        },
        getWeaponType: function () {
            return 2;
        },
        update: function () {
            if (this._ammo > 0) {
                this._shotDelay = (this._shotDelay - 1) | 0;
                if (this._shotDelay <= 0) {
                    this._shotDelay = this._maxShotDelay;
                    this._ammo = (this._ammo - 1) | 0;
                    if (this.entity.getHandledLocally()) {
                        var ang = BNTest.MathHelper.degreesToRadians(this._angle + 90);
                        var D = {  };
                        D.A = this._angle;

                        //float inaccuracy = 0.10f;
                        var inaccuracy = 0.13;
                        var V = BNTest.Vector2.fromRadian(-inaccuracy + (Math.random() * (inaccuracy + inaccuracy)) + ang);

                        var V1 = BNTest.Vector2.op_Multiply(V, this.bulletSpeed);
                        D.SX = V1.x;
                        //D.SY = -1.5;
                        D.SY = -0.7;
                        D.SZ = V1.y;
                        var P = BNTest.GLVec3.op_Addition$1(this.entity.getCenter(), (V));
                        D.X = P.x;
                        //D.Y = P.Y - 15;
                        D.Y = P.y - 5;
                        D.Z = P.z;

                        this.customEvent(D);
                    }

                }
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        },
        customEvent: function (evt) {
            this.entity.playSound("pew");
            var spd = new BNTest.Vector2(evt.SX, evt.SZ);
            var P = new BNTest.Projectile(this.entity.world, this.entity);
            P.solid = false;
            var M = new BNTest.Model(this.entity.game);
            M.meshes.add(this.bulletGraphic);
            P.model = M;

            //P.touchDamage = 7.5f;
            //P.touchDamage = 15f;
            //P.touchDamage = 35f;
            //P.touchDamage = 130f;
            //P.touchDamage = 140f;
            P.settouchDamage(80.0);
            //P.Scale = GLVec3.CreateUniform(2);
            //P.Scale = GLVec3.CreateUniform(2.2);
            //P.Scale = GLVec3.CreateUniform(2.5);
            //P.Scale = GLVec3.CreateUniform(1.5);

            //P.Speed = new GLVec3() + new Vector2(evt.SX, evt.SY);
            P.speed = new BNTest.GLVec3.ctor(evt.SX, evt.SY, evt.SZ);
            P.obstruction = true;
            //P.gravity = new GLVec3(0, 0.05, 0);
            P.gravity = new BNTest.GLVec3.ctor(0, 0.12, 0);
            //P.rotationSpeed = new GLVec3(0, 2, 0);
            //P.rotationSpeed = new GLVec3(0, 3, 0);
            P.rotationSpeed = new BNTest.GLVec3.ctor(0, 3.5, 0);
            P.ifriction = 0.98;
            P.bounces = true;
            P.multiHit = true;
            P.knockbackPower = 6;
            //P.AddBehavior(new LifeSpan(P, 60));

            M.rotation.y = evt.A;
            //M.Rotation.X = 45;
            M.rotation.x = 60;
            var sz = 11 * P.getScale().x;
            var HSZ = BNTest.GLVec3.createUniform(sz);
            M.customBoundingBox = new BNTest.BoundingBox.$ctor1(BNTest.GLVec3.op_Multiply$1(HSZ, -1), HSZ);
            P.customBoundingBox = M.customBoundingBox;

            P.setx(evt.X);
            P.sety(evt.Y + 2);
            P.setz(evt.Z);


            P.addBehavior(new BNTest.LifeSpan(P, this.bulletLifeSpan));
            //Vector2 sep = spd.Normalize(40);
            var sep = spd.normalize(22);
            //Vector2 up = sep.Rotate(-2.35619f);
            var up = sep.rotate(-1.57);

            //Vector2 down = sep.Rotate(2.35619f);
            P.setPosition(BNTest.GLVec3.op_Addition$1(P.getPosition(), up));
            this.entity.world.add(P);
            P = P.clone();
            P.setPosition(BNTest.GLVec3.op_Addition$1(P.getPosition(), BNTest.Vector2.op_Multiply(up, -1)));
            this.entity.world.add(P);

            P = P.clone();
            P.setPosition(BNTest.GLVec3.op_Addition$1(P.getPosition(), BNTest.Vector2.op_Multiply(up, -1)));
            this.entity.world.add(P);

        },
        fire: function (angle) {
            this._angle = angle;
            this._ammo = this._maxAmmo;
        }
    });

    Bridge.define("BNTest.PlatformerEntity", {
        inherits: [BNTest.ControllableEntity],
        onGround: false,
        friction: 0.05,
        floor: null,
        ceiling: null,
        lastGround: null,
        cantstep: false,
        frictionActive: true,
        stepheight: 10,
        ctor: function (world) {
            this.$initialize();
            BNTest.ControllableEntity.ctor.call(this, world);
        },
        applyFriction: function () {
            if (this.onGround) {
                var rate = 0.8;
                var min = 0.15;
                if (this.floor != null) {
                    rate = 1 - (this.floor.groundFriction * 0.2);
                    min *= this.floor.groundFriction;
                    this.lastGround = this.getPosition().clone();
                    //rate *= (3+Floor.groundFriction)*0.25;
                }
                this.setHspeed(this.getHspeed()*rate);
                this.setZspeed(this.getZspeed()*rate);

                //if (Math.Abs(Hspeed) + Math.Abs(Zspeed) < 0.15)
                if (Math.abs(this.getHspeed()) + Math.abs(this.getZspeed()) < min) {
                    this.setHspeed((this.setZspeed(0), 0));
                }
            } else {
                this.setHspeed(this.getHspeed()*0.98);
                this.setZspeed(this.getZspeed()*0.98);
            }
        },
        updateCollisions: function () {
            var spd = 0.8;

            var Y = this.lastBB.min.y;
            var Y2 = this.lastBB.max.y;

            var EB = BNTest.BoundingBox.op_Multiply$1(this.lastBB, 1.5);

            var STY = ((this.lastBB.getSize().y / 2) + 3);


            var L = this.game.world.findSolidCollision(EB, this);
            //var DB = LastBB + new GLVec3(0, 5, 0);
            var DB = BNTest.BoundingBox.op_Addition(this.lastBB, new BNTest.GLVec3.ctor(0, STY / 2, 0));
            var TB;
            var ground = System.Array.init(0, null);
            var i = 0;
            while (i < L.length) {
                var E = L[i];
                TB = E.lastBB;
                var TY = (TB.min.y - STY);
                if ((TY - Y2) <= this.stepheight && TB.intersection$2(DB)) {
                    ground.push(E);
                }
                i = (i + 1) | 0;
            }
            /* var ground = L.Where(E =>
                {
                    TB = E.LastBB;
                    var TY = (TB.Min.Y - STY);
                    return (TY-Y) <= stepheight && E.LastBB.Intersection(DB);
                }).ToList();*/
            ground.sort($_.BNTest.PlatformerEntity.f1);

            var MB = BNTest.BoundingBox.op_Addition(this.lastBB, new BNTest.GLVec3.ctor(0, 5.0, 0));

            var B = null;
            if (ground.length > 0) {
                B = ground[0].lastBB;
                this.floor = ground[0];
            }

            this.cantstep = false;

            if (B == null) {
                this.onGround = false;
                this.speed.y = Math.min(this.speed.y + 0.1, 5);
                this.model.rotation.x = -16;
            } else if (this.speed.y >= 0) {
                this.onGround = true;
                this.speed.y = Math.min(this.speed.y, 0);
                this.model.rotation.x = 0;

                //Y = (B.Min.Y - 11);
                Y = (B.min.y - STY);
                if (Math.abs(this.gety() - Y) <= this.stepheight) {
                    var P = BNTest.GLVec3.op_Multiply$1(ground[0].speed, ground[0].groundFriction);
                    this.model.offset.x += P.x;
                    this.model.offset.y += P.y;
                    this.model.offset.z += P.z;
                    //Position += ground[0].Speed * ground[0].groundFriction;
                    this.sety(Y);
                } else {
                    //Position -= Speed;
                    /* if (B.Intersection(LastBB))
                        {
                            var C = LastBB.Center - B.Center;
                            if (C.RoughLength < 100)
                            {
                                C *= 0.001;
                                if (B.Intersection(LastBB + C))
                                {
                                    C += C + C + C;
                                }
                                Position.X += C.X;
                                Position.Z += C.Z;
                                LastBB += C;
                            }
                        }*/

                    if (B.intersection$2(BNTest.BoundingBox.op_Addition(this.lastBB, (new BNTest.GLVec3.ctor(this.speed.x, this.speed.y, 0))))) {
                        this.speed.x = 0;
                    }
                    if (B.intersection$2(BNTest.BoundingBox.op_Addition(this.lastBB, (new BNTest.GLVec3.ctor(0, this.speed.y, this.speed.z))))) {
                        this.speed.z = 0;
                    }


                    //cantstep = true;
                }
                //y = (B.Min.Y - 11);
            }
            TB = this.lastBB.clone();
            var PB = BNTest.BoundingBox.op_Addition(TB, this.speed);
            var CL = PB.intersection(L);
            if (L.length > 0 && CL.length > 0) {
                //if (!B.Intersection(LastBB + (new GLVec3(Speed.X, 0, 0))))
                var stuck = 0;

                TB.max.y -= (this.stepheight * 0.75);
                var S = new BNTest.GLVec3.ctor(this.speed.x, 0, 0);
                PB = BNTest.BoundingBox.op_Addition(TB, S);
                if (PB.intersection(L).length <= 0) {
                    this.model.offset.x += this.speed.x;
                    TB = BNTest.BoundingBox.op_Addition(TB, S);
                    stuck = (stuck + 1) | 0;
                } else {
                    this.cantstep = true;
                }

                //if (!B.Intersection(LastBB + (new GLVec3(0, 0, Speed.Z))))
                S = new BNTest.GLVec3.ctor(0, 0, this.speed.z);
                PB = BNTest.BoundingBox.op_Addition(TB, S);
                if (PB.intersection(L).length <= 0) {
                    this.model.offset.z += this.speed.z;
                    TB = BNTest.BoundingBox.op_Addition(TB, S);
                    stuck = (stuck + 1) | 0;
                } else {
                    this.cantstep = true;
                }
                S = new BNTest.GLVec3.ctor(0, this.speed.y, 0);
                PB = BNTest.BoundingBox.op_Addition(TB, S);
                if (PB.intersection(L).length <= 0) {
                    //model.Offset.Y += Speed.Y;
                    //TB += S;
                    stuck = (stuck + 1) | 0;
                }
                this.model.offset.y += this.speed.y;
                if (stuck > 1) {
                    var BB = CL[0].lastBB;
                    //if (B.Intersection(LastBB))

                    {
                        var C = BNTest.GLVec3.op_Subtraction(this.lastBB.getCenter(), BB.getCenter());
                        if (C.getRoughLength() < 100) {
                            C = BNTest.GLVec3.op_Multiply$1(C, 0.001);
                            if (BB.intersection$2(BNTest.BoundingBox.op_Addition(this.lastBB, C))) {
                                C = BNTest.GLVec3.op_Addition(C, BNTest.GLVec3.op_Addition(BNTest.GLVec3.op_Addition(C, C), C));
                            }
                            this.getPosition().x += C.x;
                            this.getPosition().z += C.z;
                            this.lastBB = BNTest.BoundingBox.op_Addition(this.lastBB, C);
                        }
                    }
                }
                //model.Offset.Y += Speed.Y;
            } else {
                this.model.offset.x += this.speed.x;
                this.model.offset.y += this.speed.y;
                this.model.offset.z += this.speed.z;
                //model.Offset += Speed;
            }
        },
        update: function () {
            this.updateBehaviors();
            if (this.frictionActive) {
                this.applyFriction();
            }
            var ospd = this.speed;
            this.speed = new BNTest.GLVec3.ctor();
            BNTest.ControllableEntity.prototype.update.call(this);
            this.speed = ospd;


            this.updateCollisions();
        }
    });

    Bridge.ns("BNTest.PlatformerEntity", $_);

    Bridge.apply($_.BNTest.PlatformerEntity, {
        f1: function (TA, TTB) {
            return Bridge.compare(TA.lastBB.min.y, TTB.lastBB.min.y);
        }
    });

    Bridge.define("BNTest.PlayerCharacter", {
        inherits: [BNTest.PlatformerEntity,BNTest.ICombatant],
        animation: "idle",
        me: null,
        char: "reimu",
        canShoot: true,
        started: false,
        zpos: 0,
        maxAlpha: 1,
        infiniteAmmo: false,
        forcedAngle: null,
        canRespawn: true,
        reward: true,
        useSwingAnimation: false,
        flickerColor: null,
        _HP: 100,
        _PointsForKilling: 10,
        pmesh: null,
        invincibilityFrames: 0,
        maxInvincibilityFrames: 150,
        defense: 1,
        maxRespawnTime: 0,
        respawnTime: 0,
        respawnPosition: null,
        HB: null,
        ammo: 0.0,
        maxAmmo: 90.0,
        ammoRechargeRate: 0.7,
        ammoRechargeCooldown: 0,
        ammoMaxRechargeCooldown: 45,
        manaburnout: false,
        shootTime: 0,
        maxShootTime: 8.0,
        restTime: 0,
        knockbackResistLevel: 1,
        config: {
            properties: {
                Coins: 0
            },
            alias: [
            "getHP", "BNTest$ICombatant$getHP",
            "setHP", "BNTest$ICombatant$setHP",
            "getPointsForKilling", "BNTest$ICombatant$getPointsForKilling",
            "getTargetPriority", "BNTest$ICombatant$getTargetPriority",
            "onDamaged", "BNTest$ICombatant$onDamaged",
            "onDeath", "BNTest$ICombatant$onDeath",
            "onKill", "BNTest$ICombatant$onKill"
            ]
        },
        ctor: function (world, me, character, team) {
            if (team === void 0) { team = -1000; }

            this.$initialize();
            BNTest.PlatformerEntity.ctor.call(this, world);
            var $t;
            //Team = 0;
            this.game = world.game;
            this.controller = System.Array.init(6, false);
            this.model = new BNTest.Model(this.game);
            //model.alpha = 0.5f;
            var smooth = this.game.smooth;
            this.groundFriction = 0.7;
            this.me = me;
            var csz = 8.0;
            var hsz = csz / 2;
            this.customBoundingBox = new BNTest.BoundingBox.$ctor1(new BNTest.GLVec3.ctor(-hsz, -csz, -hsz), new BNTest.GLVec3.ctor(hsz, csz, hsz));
            this.setHitboxSize(hsz);
            this.char = character;
            //Char = "reimu";
            var weaponGraphic = "object/amulet";
            this.team = team;
            if (this.team === -1000) {
                if (me.CPU) {
                    this.team = 1;
                } else {
                    this.team = 0;
                }
            }
            if (me.CPU) {
                if (false && Math.random() < 0.2) {
                    this.char = "reisen";
                    //Char = "youmu";
                    //Char = "marisa";
                }

                //if (me.minion)
                {
                    this.maxInvincibilityFrames = 0;
                }
                /* Char = "suika";
                    if (Game.NPCs % 6 == 5)
                    {
                        Char = "cirno";
                    }
                    if (Game.NPCs>20 && Game.NPCs % 8==7)
                    {
                        if (Game.NPCs % 24 == 23)
                        {
                            Char = "sakuya";
                        }
                        else
                        {
                            Char = "sanae";
                        }
                    }*/
                this.canShoot = false;
            } else {
                this.infiniteAmmo = true;
            }
            var weapons = new (System.Collections.Generic.Dictionary$2(String,String))();
            weapons.set("sakuya", "object/knife");
            weapons.set("cirno", "object/ice");
            weapons.set("marisa", "object/star");
            weapons.set("reisen", "object/bullet");
            weapons.set("koishi", (weapons.set("satori", "object/heart"), "object/heart"));
            weapons.set("aya", ($t = (weapons.set("tenshi", "object/wind"), "object/wind"), weapons.set("youmu", $t), $t));
            if (weapons.containsKey(this.char)) {
                weaponGraphic = weapons.get(this.char);
            }
            /* if (Char == "sakuya")
                {
                    weaponGraphic = "object/knife";
                }
                else if (Char == "cirno")
                {
                    weaponGraphic = "object/ice";
                }
                else if (Char == "marisa")
                {
                    weaponGraphic = "object/star";
                }
                else if (Char == "koishi" || Char == "satori")
                {
                    weaponGraphic = "object/heart";
                }
                else if (Char == "aya")
                {
                    weaponGraphic = "object/wind";
                }
                else if (Char == "youmu")
                {
                    weaponGraphic = "object/wind";
                }
                else if (Char == "reisen")
                {
                    weaponGraphic = "object/bullet";
                }
                else if (Char == "tenshi")
                {
                    weaponGraphic = "object/wind";
                }*/
            var tmdl = BNTest.ModelCache.get_this().get(this.char, false);

            if (tmdl != null) {
                console.log(System.String.concat(System.String.concat("loading \"", this.char), "\" model from cache."));
                this.model.copyFrom(tmdl);
                this.initCPU();
                this.initModel();
            } else {
                BNTest.AnimationLoader.get_this().asyncGet$1(["head/base", "head/rahmoo", "head/rahmooacc", "head/rahmoobow", "head/hairclip", "head/suikahorns", "head/suikabow", "head/ponytailbow", "body/rahmoo", "body/top", "arm/base", "arm/dSleeve", "arm/bracelet", "foot/base", "foot/shoe", "head/maidheadband", "head/medium", "body/apron", "body/icewings", "head/witchhat", "arm/shortsleeve", "head/hatbow", "head/wideRim", "head/mediumRim", "head/cap", "body/thirdeye", "foot/anklet", "foot/lanklet", "foot/socks", "head/tokin", "body/shortskirt", "body/tie", "head/headband", "head/sideribbon", "object/katana", "arm/sleeve", "body/shortskirtfrill", "body/sidependant", "head/reisenears", "body/bunnytail", "body/rainbowmidfrill", "head/peaches"], Bridge.fn.bind(this, function () {
                    var $t1, $t2, $t3, $t4;
                    tmdl = BNTest.ModelCache.get_this().get(this.char, false);

                    if (tmdl != null) {
                        console.log(System.String.concat(System.String.concat("loading \"", this.char), "\" model from cache."));
                        this.model.copyFrom(tmdl);
                        this.initCPU();
                        this.initModel();
                        return;
                    }
                    if (this.model != null) {
                        this.model.unloadBuffers();
                        world.remove$1(this.model);
                    }
                    //var hd = new string[] { "head/base", "head/rahmoo", "head/rahmooacc", "head/rahmoobow" };
                    var hd = ["head/base", "head/rahmoo", "head/rahmooacc"];
                    var ht = ["head/rahmoobow"];
                    var ar = ["arm/base", "arm/dSleeve"];
                    var ft = ["foot/base", "foot/socks", "foot/shoe"];
                    var mult = 3;
                    var bdy = ["body/rahmoo"];
                    var item = [];
                    var pal = new (System.Collections.Generic.Dictionary$2(BNTest.GLColor,BNTest.GLColor))();
                    var Headpal = new (System.Collections.Generic.Dictionary$2(BNTest.GLColor,BNTest.GLColor))();
                    var Hatpal = new (System.Collections.Generic.Dictionary$2(BNTest.GLColor,BNTest.GLColor))();
                    var Bodypal = new (System.Collections.Generic.Dictionary$2(BNTest.GLColor,BNTest.GLColor))();
                    var Footpal = new (System.Collections.Generic.Dictionary$2(BNTest.GLColor,BNTest.GLColor))();
                    var Armpal = new (System.Collections.Generic.Dictionary$2(BNTest.GLColor,BNTest.GLColor))();
                    var Itempal = new (System.Collections.Generic.Dictionary$2(BNTest.GLColor,BNTest.GLColor))();
                    //if (Team == 1)
                    {

                        if (Bridge.referenceEquals(this.char, "sanae")) {
                            pal.set(new BNTest.GLColor(1, 0, 0), new BNTest.GLColor(0, 0, 1));
                            pal.set(new BNTest.GLColor(1, 1, 0), new BNTest.GLColor(1, 1, 1));

                            pal.set(new BNTest.GLColor(0.5, 0.25, 0), new BNTest.GLColor(0, 1, 0.3));
                            //acc = "head/hairclip";
                            hd = ["head/base", "head/rahmoo", "head/rahmooacc"];
                            ht = ["head/hairclip"];
                            bdy.push("body/top");
                        }
                        if (Bridge.referenceEquals(this.char, "suika")) {
                            //model.Scale *= 0.8;
                            this.model.scale = BNTest.GLVec3.op_Multiply$1(this.model.scale, 0.7);
                            //CustomBoundingBox *= model.Scale.X;
                            pal.set(new BNTest.GLColor(1, 0, 0), new BNTest.GLColor(0.6, 0, 0.8));
                            pal.set(new BNTest.GLColor(1, 1, 0), new BNTest.GLColor(1, 1, 1));

                            pal.set(new BNTest.GLColor(0.5, 0.25, 0), new BNTest.GLColor(1.0, 0.85, 0.35));

                            ar = ["arm/base", "arm/bracelet"];
                            hd = ["head/base", "head/rahmoo", "head/ponytailbow"];
                            ht = ["head/suikabow", "head/suikahorns"];
                            bdy.push("body/top");
                        }
                        if (Bridge.referenceEquals(this.char, "sakuya")) {
                            pal.set(new BNTest.GLColor(1, 0, 0), new BNTest.GLColor(0.5, 0, 0.9));
                            pal.set(new BNTest.GLColor(1, 1, 0), new BNTest.GLColor(1, 1, 1));

                            pal.set(new BNTest.GLColor(0.5, 0.25, 0), new BNTest.GLColor(0.8, 0.8, 0.8));
                            //acc = "head/hairclip";
                            hd = ["head/base", "head/medium"];
                            ht = ["head/maidheadband"];
                            bdy.push("body/apron");
                            ar = ["arm/base", "arm/shortsleeve"];
                        }
                        if (Bridge.referenceEquals(this.char, "cirno")) {
                            pal.set(new BNTest.GLColor(1, 0, 0), ($t1 = new BNTest.GLColor(0.3, 0.6, 1.0), Hatpal.set(new BNTest.GLColor(1, 1, 1), $t1), $t1));
                            pal.set(new BNTest.GLColor(1, 1, 0), new BNTest.GLColor(1, 1, 1));

                            pal.set(new BNTest.GLColor(0.5, 0.25, 0), new BNTest.GLColor(0.1, 0.75, 1.0));

                            //acc = "head/hairclip";
                            hd = ["head/base", "head/medium"];
                            ht = ["head/rahmoobow"];
                            bdy.push("body/icewings");
                            ar = ["arm/base", "arm/shortsleeve"];
                        }
                        if (Bridge.referenceEquals(this.char, "marisa")) {
                            pal.set(new BNTest.GLColor(1, 0, 0), new BNTest.GLColor(0.1, 0.1, 0.1));
                            pal.set(new BNTest.GLColor(1, 1, 0), new BNTest.GLColor(1, 1, 1));

                            pal.set(new BNTest.GLColor(0.5, 0.25, 0), new BNTest.GLColor(1.0, 0.85, 0.35));
                            //hd = new string[] { "head/base", "head/rahmoo", "head/witchhat", "head/hatbow", "head/wideRim" };
                            hd = ["head/base", "head/rahmoo"];
                            ht = ["head/witchhat", "head/hatbow", "head/mediumRim"];
                            bdy.push("body/apron");
                            ar = ["arm/base", "arm/shortsleeve"];
                        }
                        if (Bridge.referenceEquals(this.char, "koishi")) {
                            pal.set(new BNTest.GLColor(1, 0, 0), new BNTest.GLColor(0, 0.7, 0.2));
                            pal.set(new BNTest.GLColor(1, 1, 0), new BNTest.GLColor(0, 0.7, 1));

                            pal.set(new BNTest.GLColor(0.5, 0.25, 0), new BNTest.GLColor(0.35, 1.0, 0.45));
                            //hd = new string[] { "head/base", "head/rahmoo", "head/witchhat", "head/hatbow", "head/wideRim" };
                            hd = ["head/base", "head/rahmoo"];
                            ht = ["head/cap", "head/hatbow", "head/mediumRim"];
                            //Hatpal[new GLColor()] = new GLColor(0.698,0,1);
                            Hatpal.set(new BNTest.GLColor(0.698, 0, 1), ($t2 = new BNTest.GLColor(1.0, 0.85, 0.35), Hatpal.set(new BNTest.GLColor(1, 1, 1), $t2), $t2));
                            bdy.push("body/top", "body/thirdeye");
                            //Bodypal[new GLColor(1, 1, 1)] = new GLColor(1.0, 0.90, 0.40);
                            pal.set(new BNTest.GLColor(1, 1, 1), new BNTest.GLColor(1.0, 0.9, 0.4));
                            pal.set(new BNTest.GLColor(1, 0.5, 0.5), ($t3 = new BNTest.GLColor(0.8, 0, 0.9), Footpal.set(new BNTest.GLColor(0.5, 0.5, 0.5), $t3), $t3));
                            ar = ["arm/base", "arm/shortsleeve"];
                            ft.push("foot/lanklet");
                            //model.alpha = 0.1f;

                        }
                        if (Bridge.referenceEquals(this.char, "aya")) {
                            pal.set(new BNTest.GLColor(1, 0, 0), new BNTest.GLColor(0, 0, 0));
                            pal.set(new BNTest.GLColor(1, 1, 0), new BNTest.GLColor(0, 0, 0));

                            pal.set(new BNTest.GLColor(0.5, 0.25, 0), BNTest.GLColor.createShade(0.15));

                            hd = ["head/base", "head/medium"];
                            ht = ["head/tokin"];
                            bdy = ["body/shortskirt", "body/shortskirtfrill", "body/top", "body/tie"];
                            ar = ["arm/base", "arm/shortsleeve"];
                            //bdy.Push("body/top");
                            Hatpal.set(new BNTest.GLColor(0, 0, 0), new BNTest.GLColor(0.85, 0, 0));
                            //Bodypal[new GLColor(1, 1, 1)] = new GLColor(0, 0, 0);
                        }
                        if (Bridge.referenceEquals(this.char, "youmu")) {
                            Bodypal.set(new BNTest.GLColor(1, 0, 0), new BNTest.GLColor(0, 0.7, 0.2));
                            pal.set(new BNTest.GLColor(1, 1, 0), new BNTest.GLColor(1, 1, 1));

                            pal.set(new BNTest.GLColor(0.5, 0.25, 0), new BNTest.GLColor(1, 1, 1));

                            hd = ["head/base", "head/medium"];
                            ht = ["head/headband", "head/sideribbon"];
                            bdy = ["body/shortskirt", "body/shortskirtfrill", "body/top", "body/tie"];
                            ar = ["arm/base", "arm/shortsleeve"];
                            //Bodypal[new GLColor(1, 1, 1)] = new GLColor(0.05, 0.80, 0.25);
                            //bdy.Push("body/top");
                            Hatpal.set(new BNTest.GLColor(1, 0, 0), new BNTest.GLColor(0, 0, 0));
                            //Bodypal[new GLColor(1, 1, 1)] = new GLColor(0, 0, 0);

                            item = ["object/katana"];
                        }
                        if (Bridge.referenceEquals(this.char, "reisen")) {
                            Bodypal.set(new BNTest.GLColor(1, 0, 0), new BNTest.GLColor(1, 0.45, 0.45));
                            Bodypal.set(new BNTest.GLColor(1, 1, 0), new BNTest.GLColor(1, 1, 1));

                            //pal[new GLColor(0.5, 0.25, 0)] = new GLColor(1, 0.55, 0.85);
                            pal.set(new BNTest.GLColor(0.5, 0.25, 0), new BNTest.GLColor(0.9, 0.55, 0.85));

                            hd = ["head/base", "head/rahmoo"];
                            ht = ["head/reisenears"];
                            bdy = ["body/shortskirt", "body/top", "body/sidependant", "body/tie", "body/bunnytail"];
                            ar = ["arm/base", "arm/sleeve"];
                            Bodypal.set(new BNTest.GLColor(1, 1, 1), ($t4 = BNTest.GLColor.createShade(0.15), Armpal.set(new BNTest.GLColor(1, 1, 1), $t4), $t4));
                            //Hatpal[new GLColor(0, 0, 0)] = new GLColor(0.85, 0, 0);
                            //Bodypal[new GLColor(1, 1, 1)] = new GLColor(0, 0, 0);
                        }
                        if (Bridge.referenceEquals(this.char, "tenshi")) {
                            Bodypal.set(new BNTest.GLColor(1, 0, 0), new BNTest.GLColor(0.3, 0.3, 0.85));
                            Bodypal.set(new BNTest.GLColor(1, 1, 0), new BNTest.GLColor(1, 0, 0));

                            //pal[new GLColor(0.5, 0.25, 0)] = new GLColor(1, 0.55, 0.85);
                            pal.set(new BNTest.GLColor(0.5, 0.25, 0), new BNTest.GLColor(0.3, 0.3, 0.85));
                            Hatpal.set(new BNTest.GLColor(1, 1, 1), new BNTest.GLColor());

                            hd = ["head/base", "head/rahmoo"];
                            ht = ["head/cap", "head/mediumRim", "head/peaches"];
                            bdy = ["body/rahmoo", "body/top", "body/tie", "body/rainbowmidfrill"];
                            ar = ["arm/base", "arm/shortsleeve"];

                            item = ["object/katana"];
                            Itempal.set(new BNTest.GLColor(1, 1, 1), new BNTest.GLColor(1, 0.4, 0.4));
                            //Bodypal[new GLColor(1, 1, 1)] = Armpal[new GLColor(1, 1, 1)] = GLColor.CreateShade(0.15);
                            //Hatpal[new GLColor(0, 0, 0)] = new GLColor(0.85, 0, 0);
                            //Bodypal[new GLColor(1, 1, 1)] = new GLColor(0, 0, 0);
                        }

                        //bdy = new string[] { "body/rahmoo", "body/top" };
                        if (this.team === 1) {
                            this.initCPU();
                        }
                    }

                    //model = new Model(game);
                    var off = this.model.offset;
                    this.model.offset = off;

                    world.add$1(this.model);
                    this.model.Dir = 1;
                    this.model.Max = 2.25;
                    this.model.Spd = 0.075 * mult;

                    var body = BNTest.VoxelMap.fromAnimationCombo(bdy);
                    body.applyPalette(pal);
                    body.applyPalette(Bodypal);
                    var M = new BNTest.Mesh(this.game);
                    M.Dir = 1;
                    M.Max = 2.25;
                    M.Spd = 0.075 * mult;

                    M.addVoxelMap(body, smooth);
                    this.model.meshes.add(M);

                    var arm = BNTest.VoxelMap.fromAnimationCombo(ar);
                    arm.applyPalette(pal);
                    arm.applyPalette(Armpal);
                    M = new BNTest.Mesh(this.game);
                    M.Dir = 1;
                    M.Spd = 1.5 * mult;
                    M.addVoxelMap(arm, smooth);
                    M.offset.x = 1.5;
                    M.offset.y = 3;
                    M.rotation.z = 45;
                    if (item.length > 0) {
                        var itm = BNTest.VoxelMap.fromAnimationCombo(item);
                        itm.applyPalette(Itempal);
                        var mitem = new BNTest.Mesh(this.game);
                        mitem.addVoxelMap(itm, smooth);
                        /* mitem.Rotation.X = -120;
                            mitem.Rotation.Y = -45;
                            mitem.Offset.X = -1;
                            mitem.Offset.Y = -1;
                            mitem.Offset.Z = 8;*/
                        mitem.rotation.x = -90;
                        mitem.offset.x = -1;
                        mitem.offset.y = 3;
                        mitem.offset.z = 9;
                        mitem.updateTranformation();
                        mitem.morphGeometry(mitem.transformation);
                        M.combine(mitem);
                    }
                    this.model.meshes.add(M);
                    M = new BNTest.Mesh(this.game);
                    M.Dir = -1;
                    M.Spd = 1.5 * mult;
                    M.addVoxelMap(arm, smooth);
                    M.offset.x = -1.5;
                    M.offset.y = 3;
                    M.rotation.z = -45;
                    this.model.meshes.add(M);

                    var foot = BNTest.VoxelMap.fromAnimationCombo(ft);
                    foot.applyPalette(pal);
                    foot.applyPalette(Footpal);
                    M = new BNTest.Mesh(this.game);
                    M.Dir = -1;
                    M.Spd = 1.5 * mult;
                    //M["Max"] = 35;
                    M.addVoxelMap(foot, smooth);
                    M.offset.x = 1.5;
                    M.offset.y = 7;
                    this.model.meshes.add(M);
                    M = new BNTest.Mesh(this.game);
                    M.Dir = 1;
                    M.Spd = 1.5 * mult;
                    //M["Max"] = 35;
                    M.addVoxelMap(foot, smooth);
                    M.offset.x = -1.5;
                    M.offset.y = 7;
                    this.model.meshes.add(M);

                    var head = BNTest.VoxelMap.fromAnimationCombo(hd);
                    head.applyPalette(pal);
                    head.applyPalette(Headpal);
                    var hat = BNTest.VoxelMap.fromAnimationCombo(ht);
                    hat.applyPalette(pal);
                    hat.applyPalette(Hatpal);
                    head.combine(hat);
                    M = new BNTest.Mesh(this.game);
                    M.Dir = 1;
                    M.Max = 4.5;
                    M.Spd = 0.15 * mult;
                    M.addVoxelMap(head, smooth);
                    this.model.meshes.add(M);


                    //model.Smoothen();
                    if (tmdl == null) {
                        BNTest.ModelCache.get_this().set$1(this.char, this.model);
                    }
                }));
            }

            this.addBehavior(new BNTest.PlatformerControls(this));
            var secondaryWeaponGraphic = "";
            if (Bridge.referenceEquals(this.char, "koishi")) {
                this.addBehavior(new BNTest.RingShot(this));
                if (!(this.game.localplayer == null || Bridge.referenceEquals(this.game.localplayer.character, this) || this.game.localplayer.character == null)) {
                    this.maxAlpha = 0.05;
                    this.zpos = 1;
                }
            } else if (Bridge.referenceEquals(this.char, "youmu")) {
                //AddBehavior(new RapidFireGun(this));
                this.addBehavior(new BNTest.BasicSword(this));
                this.addBehavior(new BNTest.SwordSwing(this));
                var O = new BNTest.Orb(world, this);
                world.add(O);
            } else if (Bridge.referenceEquals(this.char, "sakuya")) {
                this.addBehavior(new BNTest.WideShot(this));
            } else if (Bridge.referenceEquals(this.char, "tenshi")) {
                this.addBehavior(new BNTest.BasicSword(this));
            } else {
                this.addBehavior(new BNTest.RapidFireGun(this));
            }
            //secondary
            if (Bridge.referenceEquals(this.char, "reisen")) {
                this.addBehavior(new BNTest.SpawnIllusions(this));
            }
            if (Bridge.referenceEquals(this.char, "reimu")) {
                this.addBehavior(new BNTest.YinYangOrbGun(this));
                secondaryWeaponGraphic = "object/yinyangorb";
            }
            var speedrate = this.game.bulletSpeedRate;
            var minion = me.minion;
            if (me.CPU && minion) {
                //GetBehavior<PlatformerControls>().maxSpeed *= 0.67f;
                //GetBehavior<PlatformerControls>().maxSpeed *= 0.5f;
                var spd = 0.4;
                var T2 = this.getBehavior(BNTest.IWeaponBehavior);

                if (Bridge.referenceEquals(this.char, "aya")) {
                    this.canShoot = true;

                    var T = new BNTest.EnemyStrafer(this);
                    //T.FramesPerTick = 20;
                    T.framesPerTick = 10;
                    T.predict = false;
                    this.addBehavior(T);
                    //default stuff is sanae

                    T2._maxAmmo = 1;
                    T2.bulletSpeed = 2.5;
                    T2.bulletLifeSpan = 450;
                    T2._maxShotDelay = 40;
                    var TimeToRespawn = 15;
                    this.maxRespawnTime = (60 * TimeToRespawn) | 0;
                    this.defense = 1.4;
                    spd = 0.75;
                } else if (Bridge.referenceEquals(this.char, "youmu")) {
                    this.canShoot = true;

                    var T1 = new BNTest.EnemyStrafer(this);
                    //T.FramesPerTick = 20;
                    T1.framesPerTick = 10;
                    T1.predict = false;
                    T1.attackType = 6;
                    this.addBehavior(T1);
                    //T.attackrange = 100;
                    T1.attackrange = 150;
                    //default stuff is sanae
                    //RapidFireGun T2 = GetBehavior<IWeaponBehavior>().As<RapidFireGun>();
                    //T2.MinCoolDown = 300;
                    //T2.MinCoolDown = 180;
                    var T3 = this.getBehavior$1(BNTest.IWeaponBehavior, $_.BNTest.PlayerCharacter.f1);
                    T3.minCoolDown = 120;

                    /* T2._maxAmmo = 1;
                        T2.bulletSpeed = 2.5f;
                        T2.bulletLifeSpan = 450;
                        T2._maxShotDelay = 40;*/
                    var TimeToRespawn1 = 18;
                    this.maxRespawnTime = (60 * TimeToRespawn1) | 0;
                    this.defense = 3.4;
                    spd = 0.6;
                }
                if (Bridge.referenceEquals(this.char, "reisen")) {
                    var TimeToRespawn2 = 6;
                    var T4 = new BNTest.ProximityAttacker(this);
                    T4.framesPerTick = 20;
                    this.defense = 1.4;
                    this.canShoot = true;
                    this.addBehavior(T4);
                    this.maxRespawnTime = (60 * TimeToRespawn2) | 0;
                    var mod = 5;
                    T2.bulletSpeed /= mod;
                    T2.bulletLifeSpan = (T2.bulletLifeSpan * mod) | 0;
                    T2.minCoolDown += 30;
                    spd = 0.5;

                    T2._maxAmmo = 1;

                }

                if (Bridge.referenceEquals(this.char, "sanae") || Bridge.referenceEquals(this.char, "sakuya") || Bridge.referenceEquals(this.char, "cirno") || Bridge.referenceEquals(this.char, "marisa")) {
                    this.canShoot = true;

                    var T5 = new BNTest.EnemyEngager(this);
                    T5.framesPerTick = 40;
                    T5.predict = false;
                    this.addBehavior(T5);
                    //default stuff is sanae
                    //RapidFireGun T2 = GetBehavior<IWeaponBehavior>().As<RapidFireGun>();
                    T2._maxAmmo = 1;
                    T2.bulletSpeed = 3.0;
                    T2.bulletLifeSpan = 450;
                    //T2._maxShotDelay = 20;
                    T2._maxShotDelay = 30;
                    if (Bridge.referenceEquals(this.char, "sanae")) {
                        //T2.MinCoolDown *= 1.5f;
                    }
                    var TimeToRespawn3 = 6;


                    if (Bridge.referenceEquals(this.char, "sakuya")) {
                        T2.bulletSpeed = 2.5;
                        T2.bulletLifeSpan = 600;
                        T2._maxShotDelay = 100;

                        T5.predict = true;
                        T5.framesPerTick = 20;

                        TimeToRespawn3 = 13;
                        this.defense = 1.4;
                    }
                    if (Bridge.referenceEquals(this.char, "cirno")) {
                        T2.bulletLifeSpan = 30;
                        T2._maxShotDelay = 12;
                        spd *= 1.5;
                        T5.framesPerTick = 15;
                        this.defense = 2;

                        T5.passive = true;

                        TimeToRespawn3 = 3;
                    }
                    this.maxRespawnTime = (60 * TimeToRespawn3) | 0;

                }

                if (T2 != null) {
                    T2._maxShotDelay = Bridge.Int.clip32(Bridge.Math.round(T2._maxShotDelay / speedrate, 0, 6));

                    T2.bulletSpeed *= speedrate;
                    T2.bulletLifeSpan = Bridge.Int.clip32(T2.bulletLifeSpan / speedrate);

                    //float sr2 = (speedrate + (speedrate * speedrate)) * 0.5f;
                    var sr2 = Math.pow(speedrate, 1.5);
                    this.maxAmmo *= sr2;
                    this.ammoRechargeRate *= sr2;
                }
                this.getBehavior(BNTest.PlatformerControls).maxSpeed *= spd * speedrate;
            }
            if (me.CPU && !minion) {
                var T21 = this.getBehavior(BNTest.IWeaponBehavior);
                if (!Bridge.referenceEquals(this.char, "tenshi")) {

                    var T6 = new BNTest.ProximityAttacker(this);
                    T6.framesPerTick = 20;
                    T6.predict = true;
                    //T.passive = true;
                    if (Bridge.referenceEquals(this.char, "koishi")) {
                        T6.aggroRange = 100;
                    } else {
                        this.maxAmmo = 1;
                        //RapidFireGun T2 = GetBehavior<IWeaponBehavior>().As<RapidFireGun>();
                        this.ammoRechargeRate = 0.00333333341;
                    }
                    this.addBehavior(T6);
                } else {
                    var T7 = new BNTest.EnemyEngager(this);
                    T7.framesPerTick = 20;
                    this.addBehavior(T7);
                }
                this.canShoot = true;
                this.maxRespawnTime = 999999999;

                if (T21 != null) {
                    T21._maxShotDelay = Bridge.Int.clip32(Bridge.Math.round(T21._maxShotDelay / speedrate, 0, 6));

                    T21.bulletSpeed *= this.game.bulletSpeedRate;
                    T21.bulletLifeSpan = Bridge.Int.clip32(T21.bulletLifeSpan / this.game.bulletSpeedRate);
                }
            }
            if (me.CPU) {
                if (Bridge.referenceEquals(this.char, "reisen")) {
                    this.addBehavior(new BNTest.SecondaryResponder(this));
                }
            }
            if (this.pmesh == null) {
                var effects = [];
                effects.push(weaponGraphic);
                if (!Bridge.referenceEquals(secondaryWeaponGraphic, "")) {
                    effects.push(secondaryWeaponGraphic);
                }
                BNTest.AnimationLoader.get_this().asyncGet$1(effects, Bridge.fn.bind(this, function () {
                    var pal = new (System.Collections.Generic.Dictionary$2(BNTest.GLColor,BNTest.GLColor))();
                    if (me.CPU) {
                        pal.set(new BNTest.GLColor(1, 0, 0), new BNTest.GLColor(0, 0, 1));
                    }
                    var TPM = BNTest.ModelCache.get_this().get(System.String.concat("W1:", weaponGraphic));
                    var VM;
                    if (TPM != null) {
                        this.pmesh = TPM.meshes.getItem(0);
                    } else {
                        this.pmesh = new BNTest.Mesh(this.game);
                        VM = BNTest.VoxelMap.fromImages$1(weaponGraphic);
                        //VoxelMap VM = VoxelMap.FromImages(AnimationLoader.Get(weaponGraphic));
                        VM.swapYZ();
                        this.pmesh.addVoxelMap(VM);

                        BNTest.ModelCache.get_this().set(System.String.concat("W1:", weaponGraphic), this.pmesh);
                    }
                    this.pmesh.applyPalette(pal);
                    var weapon = this.getBehavior$1(BNTest.IWeaponBehavior, $_.BNTest.PlayerCharacter.f2);
                    var weapon2 = this.getBehavior$1(BNTest.IWeaponBehavior, $_.BNTest.PlayerCharacter.f3);
                    weapon.bulletGraphic = this.pmesh;
                    if (weapon2 != null && !Bridge.referenceEquals(secondaryWeaponGraphic, "")) {
                        var w2msh = null;
                        TPM = BNTest.ModelCache.get_this().get(System.String.concat("W2:", secondaryWeaponGraphic));
                        if (TPM != null) {
                            w2msh = TPM.meshes.getItem(0);
                        } else {
                            w2msh = new BNTest.Mesh(this.game);
                            VM = BNTest.VoxelMap.fromImages$1(secondaryWeaponGraphic);
                            VM.swapYZ();
                            w2msh.addVoxelMap(VM);
                            BNTest.ModelCache.get_this().set(System.String.concat("W2:", secondaryWeaponGraphic), w2msh);
                        }
                        w2msh.applyPalette(pal);
                        weapon2.bulletGraphic = w2msh;
                    } else if (weapon2 != null) {
                        weapon2.bulletGraphic = this.pmesh;
                    }
                    //GetBehavior<IWeaponBehavior>().As<RapidFireGun>().BulletGraphic = Pmesh;
                }));
            }
            if (me.CPU && Bridge.referenceEquals(this.char, this.game.localplayer.character.char)) {
                this.model.color = new BNTest.GLColor(0.25, 0.25, 0.25);
            }
    },
    getHP: function () {
        return this._HP;
    },
    setHP: function (value) {
        this._HP = value;
    },
    getPointsForKilling: function () {
        return this._PointsForKilling;
    },
    getTargetPriority: function () {
        return 10;
    },
    getHitboxSize: function () {
        //return Hitbox.Size.X;
        return this.HB.getSize().x;
    },
    setHitboxSize: function (value) {
        //Hitbox = new BoundingBox(value);
        this.HB = new BNTest.BoundingBox.$ctor2(value);
        this.getHitbox();
    },
    getHitbox: function () {
        this.HB.setPosition(this.model.offset);
        return this.HB;
        //return Hitbox + Position;
    },
    initModel: function () {
        //double mult = 3;
        var mult = 3.5;

        var i = 0;


        this.model.Dir = 1;
        this.model.Max = 2.25;
        this.model.Spd = 0.075 * mult;

        var M = this.model.meshes.getItem(Bridge.identity(i, (i = (i + 1) | 0)));
        M.Dir = 1;
        M.Max = 2.25;
        M.Spd = 0.075 * mult;
        M.rotation = new BNTest.GLVec3.ctor();


        M = this.model.meshes.getItem(Bridge.identity(i, (i = (i + 1) | 0)));
        M.Dir = 1;
        M.Spd = 1.5 * mult;

        M.offset.x = 1.5;
        M.offset.y = 3;
        M.rotation = new BNTest.GLVec3.ctor();
        M.rotation.z = 45;

        M = this.model.meshes.getItem(Bridge.identity(i, (i = (i + 1) | 0)));
        M.Dir = -1;
        M.Spd = 1.5 * mult;

        M.offset.x = -1.5;
        M.offset.y = 3;
        M.rotation = new BNTest.GLVec3.ctor();
        M.rotation.z = -45;


        M = this.model.meshes.getItem(Bridge.identity(i, (i = (i + 1) | 0)));
        M.Dir = -1;
        M.Spd = 1.5 * mult;
        //M["Max"] = 35;

        M.offset.x = 1.5;
        M.offset.y = 7;
        M.rotation = new BNTest.GLVec3.ctor();

        M = this.model.meshes.getItem(Bridge.identity(i, (i = (i + 1) | 0)));
        M.Dir = 1;
        M.Spd = 1.5 * mult;
        //M["Max"] = 35;

        M.offset.x = -1.5;
        M.offset.y = 7;
        M.rotation = new BNTest.GLVec3.ctor();


        M = this.model.meshes.getItem(Bridge.identity(i, (i = (i + 1) | 0)));
        M.Dir = 1;
        M.Max = 4.5;
        M.Spd = 0.15 * mult;
        M.rotation = new BNTest.GLVec3.ctor();
    },
    initCPU: function () {
        var T = new BNTest.NavigatorAI(this);
        T.framesPerTick = 0;
        this.addBehavior(T);
        T = new BNTest.WanderAI(this);
        T.framesPerTick = 25;
        Bridge.cast(T, BNTest.WanderAI).range = 20;
        this.addBehavior(T);

        T = new BNTest.EntityFollower(this, System.Linq.Enumerable.from(this.world.entities).ofType(BNTest.PlayerCharacter).toArray()[0]);
        T.framesPerTick = 10;
        //AddBehavior(T);

        T = new BNTest.AimedWandering(this);
        Bridge.cast(T, BNTest.AimedWandering).target = System.Linq.Enumerable.from(this.world.entities).ofType(BNTest.DonationBox).toArray()[0];
        T.framesPerTick = 50;
        this.addBehavior(T);

        var NS = new BNTest.NetworkSync(this);

        if (this.me.CPU) {
            NS.framesPerTick = 45;
        }
        NS.forcesFlush = true;
        NS.updateOnSync = true;
        this.addBehavior(NS);
    },
    updateShoot: function () {
        //IWeaponBehavior weapon = GetBehavior<IWeaponBehavior>(WB => ((IWeaponBehavior)WB).WeaponType == 1);
        var weapon = this.getBehavior$1(BNTest.IWeaponBehavior, $_.BNTest.PlayerCharacter.f2);
        var weapon2 = this.getBehavior$1(BNTest.IWeaponBehavior, $_.BNTest.PlayerCharacter.f3);
        var ang = this.model.rotation.y;
        weapon.BNTest$IWeaponBehavior$setFiringAngle(ang);
        this.shootTime -= 1.0;

        if (this.shootTime <= 0) {
            //if (Controller[4]/* && ammo>=1*/ && !manaburnout)
            //if (Controller[4] && !LController[4])
            var resting = true;
            if (this.controller[5] && !this.manaburnout) {
                resting = false;
                //shootTime += maxShootTime;
                /* Fire();
                        ammo -= 1;*/
                this.restTime = 0;

                if (weapon != null) {
                    this.shootTime += weapon.BNTest$IWeaponBehavior$getMaxCooldown();
                    weapon.BNTest$IWeaponBehavior$fire(ang);
                    this.ammo -= weapon.BNTest$IWeaponBehavior$getEnergyCost();
                }
                this.ammoRechargeCooldown = Math.max(this.ammoRechargeCooldown, this.ammoMaxRechargeCooldown);
                this.model.alpha = 1;
            }
            if (this.controller[6] && !this.manaburnout) {
                resting = false;
                this.restTime = 0;

                if (weapon2 != null) {
                    this.shootTime += weapon2.BNTest$IWeaponBehavior$getMaxCooldown();
                    weapon2.BNTest$IWeaponBehavior$fire(ang);
                    this.ammo -= weapon2.BNTest$IWeaponBehavior$getEnergyCost();
                }
                this.ammoRechargeCooldown = Math.max(this.ammoRechargeCooldown, this.ammoMaxRechargeCooldown);
                this.model.alpha = 1;
            }
            if (resting) {
                this.shootTime = 0;
                this.restTime = (this.restTime + 1) | 0;
            }
        } else {
            this.ammoRechargeCooldown = Math.max(this.ammoRechargeCooldown, this.ammoMaxRechargeCooldown);
        }
        this.ammoRechargeCooldown -= 1.0;
        if (this.ammoRechargeCooldown <= 0) {
            var rate = this.ammoRechargeRate;
            if (this.manaburnout) {
                //rate *= 1.5f;
            }
            this.ammo = Math.min(this.ammo + rate, this.maxAmmo);
        }
    },
    update: function () {

        if (this.respawnPosition == null) {
            this.respawnPosition = this.getPosition().clone();
        }
        if (this.respawnTime > 0) {
            this.model.setVisible(false);
            this.lastBB = new BNTest.BoundingBox.ctor();
            this.respawnTime = (this.respawnTime - 1) | 0;
            if (!this.me.CPU) {
                //Position = ((Position + RespawnPosition) * 0.5);
                this.setPosition(BNTest.GLVec3.lerp(this.getPosition(), this.respawnPosition, 0.015));
                var Dist = (BNTest.GLVec3.op_Subtraction(this.respawnPosition, this.getPosition()));
                if (this.respawnTime <= 0 || Dist.getLength() <= 0.5) {
                    this.setPosition(this.respawnPosition.clone());
                } else {
                    this.setPosition(BNTest.GLVec3.op_Addition(this.getPosition(), Dist.normalize(0.5)));
                }
            }
            return;
        }
        BNTest.PlatformerEntity.prototype.update.call(this);
        if (this.canShoot && this.pmesh != null) {
            this.updateShoot();
            if (!this.infiniteAmmo) {
                if (this.ammo < 0) {
                    this.ammo = 0;
                    this.manaburnout = true;
                    this.ammoRechargeCooldown = Math.max(this.ammoRechargeCooldown, this.ammoMaxRechargeCooldown);
                } else if (this.ammo >= this.maxAmmo) {
                    this.manaburnout = false;
                }
            }
        }

        if (!this.onGround) {
            if (this.gety() > 200 || (this.gety() < -500 && this.speed.y < 0)) {
                this.setx(0);
                this.sety(-120);
                this.setz(0);
                this.speed = new BNTest.GLVec3.ctor();
                this.model.rotation.x = 0;
                if (this.me.CPU) {
                    //onDeath(null);
                    var H = this.getHP();
                    this.game.setNPC(this);
                    this.setHP(H);
                }
            }
        }
        if (this.model.inView) {
            this.animate();
        }
    },
    animate: function () {
        if (this.flickerColor != null && (this.game.frame & 2) > 0) {
            this.model.color = this.flickerColor;
        } else {
            this.model.color = new BNTest.GLColor(1, 1, 1);
        }
        var meshcount = this.model.meshes.getCount();
        if (meshcount < 5) {
            return;
        }

        //if (!started)
        {
            //started = true;
            if (this.zpos > 0) {
                this.world.bringToFront(this.model);
            }
            if (this.zpos < 0) {
                this.world.sendToBack(this.model);
            }
        }
        if (this.invincibilityFrames > 0) {
            this.model.setVisible(!this.model.getVisible());
            this.invincibilityFrames = (this.invincibilityFrames - 1) | 0;
        } else {
            this.model.setVisible(true);
            if (this.model.alpha > this.maxAlpha) {
                this.model.alpha = Math.max(this.maxAlpha, this.model.alpha - 0.007);
            } else if (this.model.alpha < this.maxAlpha) {
                this.model.alpha = Math.min(this.maxAlpha, this.model.alpha + 0.01);
            }
        }
        if (this.onGround && !this.me.CPU) {
            this.model.rotation.y = BNTest.MathHelper.radiansToDegrees(this.game.mouseAngle) - 90;
        }
        var swing = false;
        if (this.useSwingAnimation && this.controller[5] && !this.manaburnout) {
            /* if (animation != "attackswing")
                    {
                        this.InitModel();
                    }*/
            if (!Bridge.referenceEquals(this.animation, "attackswing")) {
                this.model.meshes.getItem(1).rotation.x = 0;
            }
            this.animation = "attackswing";
            swing = true;
        } else {
            if (Bridge.referenceEquals(this.animation, "attackswing")) {
                this.initModel();
            }
        }
        if (this.speed.y === 0 && Bridge.referenceEquals(this.animation, "attackswing")) {
            //model.meshes[1].Rotation.X = -30;
            this.rotateTest(this.model.meshes.getItem(1), "y", 3.0, 1.25);
            this.rotateTest(this.model.meshes.getItem(1), "x", 1.2, 1.25);
        }
        if (this.speed.y === 0 && (this.speed.x !== 0 || this.speed.z !== 0)) {
            if (Bridge.referenceEquals(this.animation, "jump")) {
                this.model.meshes.getItem(3).offset.z = 0;
                this.model.meshes.getItem(4).offset.z = 0;

                this.model.meshes.getItem(3).rotation.x = 0;
                this.model.meshes.getItem(4).rotation.x = 0;
            }


            if (swing) {
                //animation = "attackswing";
            } else {
                /* if (animation == "attackswing")
                        {
                            this.InitModel();
                        }*/
                this.animation = "walk";
            }
            if (this.me.CPU) {
                //model.Rotation.Y = MathHelper.RadiansToDegrees(Speed.ToVector2().ToAngle())-90;
            }

            this.rotateTest(this.model.meshes.getItem(0));

            if (!Bridge.referenceEquals(this.animation, "attackswing")) {
                this.rotateTest(this.model.meshes.getItem(1));
                this.rotateTest(this.model.meshes.getItem(2));
            } else {

            }

            this.rotateTest(this.model.meshes.getItem(3));
            this.rotateTest(this.model.meshes.getItem(4));

            this.model.meshes.getItem(3).offset.z = -(this.model.meshes.getItem(3).rotation.x * 0.025);
            this.model.meshes.getItem(4).offset.z = -(this.model.meshes.getItem(4).rotation.x * 0.025);


            this.rotateTest(this.model.meshes.getItem(5), "y");
        } else if (!this.onGround) {
            this.animation = "jump";
            this.model.meshes.getItem(3).rotation.x = 25;
            this.model.meshes.getItem(4).rotation.x = 25;

            this.model.meshes.getItem(3).offset.z = 1.5;
            this.model.meshes.getItem(4).offset.z = 1.5;
        } else {
            this.animation = "idle";
            this.model.meshes.getItem(3).rotation.x = 0;
            this.model.meshes.getItem(4).rotation.x = 0;

            this.model.meshes.getItem(3).offset.z = 0;
            this.model.meshes.getItem(4).offset.z = 0;


            //RotateTest(model.meshes[5], "y");
        }
        if (System.Nullable.hasValue(this.forcedAngle)) {
            this.model.rotation.y = System.Nullable.getValue(this.forcedAngle);
        }
    },
    onDamaged: function (source, amount) {
        //throw new NotImplementedException();
        if (this.invincibilityFrames > 0 || this.respawnTime > 0) {
            return;
        }
        this.model.alpha = 1;
        var i = 0;
        while (i < this._behaviors.getCount()) {
            var D = this._behaviors.getItem(i);
            if (D.onAttacked) {
                D.onAttacked(source);
            }
            i = (i + 1) | 0;
        }
        var src = source;
        this.setHP(this.getHP()-((amount / this.defense)));
        if (!this.me.CPU) {
            //DropCoins(50, 5, 1);
            this.dropCoins(((5 + (((5 * (((Bridge.Int.div(this.game.wave, 2)) | 0))) | 0))) | 0), 5, 1);

            this.invincibilityFrames = this.maxInvincibilityFrames;
            if (!src.multiHit) {
                src.alive = false;
            }
            return;
        }


        this.speed = BNTest.GLVec3.op_Addition(this.speed, BNTest.GLVec3.op_Division$1((BNTest.GLVec3.op_Multiply$1(BNTest.GLVec3.op_Multiply$1(src.speed, 0.8), src.knockbackPower)), this.knockbackResistLevel));
        if (!src.multiHit) {
            src.alive = false;
        }
        this.speed.y -= 2 / this.knockbackResistLevel;

        this.invincibilityFrames = this.maxInvincibilityFrames;
    },
    dropCoins: function (MaxValue, number, permaloss, lifespan) {
        if (permaloss === void 0) { permaloss = 0; }
        if (lifespan === void 0) { lifespan = 900; }
        var i = number;
        //while (i > 0 && Coins >= 10)
        while (i > 0) {
            var c = new BNTest.Coin(this.world, lifespan);
            c.setPosition(BNTest.GLVec3.op_Addition(this.getPosition(), new BNTest.GLVec3.ctor(0, -20, 0)));
            c.solid = false;
            var m = 3;
            var m2 = (m + m) | 0;
            c.speed = new BNTest.GLVec3.ctor(((-m) | 0) + (Math.random() * m2), 0, ((-m) | 0) + (Math.random() * m2));
            c.speed.y = -1 + (((-m) | 0) * Math.random());
            c.pickupDelay = 90;
            var Value = 10;
            if (this.getCoins() > MaxValue) {
                Value = MaxValue;
                //c.Value = 50;
                //c.Scale *= 2;
            } else {
                Value = (Bridge.Int.div(MaxValue, 10)) | 0;
                if (Value < 1) {
                    Value = 1;
                }
            }
            if (((this.getCoins() - c.value) | 0) <= 0) {
                return;
            }
            c.setValue(Value);
            //prevent the final coin from spawning, the last coin is lost permanently.
            if (i > permaloss) {
                this.world.add(c);
            }
            this.setCoins((this.getCoins() - c.value) | 0);
            i = (i - 1) | 0;
        }
    },
    onDeath: function (source) {
        //throw new NotImplementedException();
        //Alive = false;

        if (this.me != null) {
            this.me.lives = (this.me.lives - 1) | 0;
        }
        this.visible = false;
        if (!this.me.CPU) {
            this.dropCoins(Bridge.Int.clip32(this.getCoins() * 0.2), 3, 1, 1500);
            this.dropCoins(((20 * this.game.wave) | 0), 1, 0, 1500);
            this.respawnTime = 120;
            this.setHP(100);
        }
        //var N = new string[] { "sakuya","sanae","cirno","aya","youmu","reisen"};
        var N = new (System.Collections.Generic.Dictionary$2(String,System.Int32))();
        N.set("sakuya", 40);
        N.set("sanae", 30);
        N.set("cirno", 20);
        N.set("aya", 80);
        N.set("youmu", 50);
        N.set("reisen", 60);
        var c = new BNTest.Coin(this.world);
        if (!this.me.minion) {
            c.setValue((((((100 * this.game.wave) | 0)) + 500) | 0));
        } else if (this.model.scale.x > 1.0) {
            //c.model.Scale *= (GLVec3.One + model.Scale) * 0.5;
            //c.CustomBoundingBox *= c.model.Scale.X;
            //c.Value = 200;
            c.setValue(200);
        } else if (N.containsKey(this.char)) {
            //c.model.Scale *= (1.75);
            //c.CustomBoundingBox *= c.model.Scale.X;
            //c.Value = 40;
            //c.SetValue(40);
            c.setValue(N.get(this.char));
        } else {
            c.setValue(10);
        }

        c.solid = false;
        c.setPosition(this.getPosition().clone());
        c.speed = BNTest.GLVec3.op_Multiply$1(this.speed, 0.35);
        /* c.Position = LastGround.Clone() + new GLVec3(0,-1,0);
                c.Position.Y += (CustomBoundingBox.Size.Y / 3);*/
        if (this.reward) {
            this.world.add(c);
        }

        if (this.me.CPU) {
            this.respawnTime = this.maxRespawnTime;
            this.alive = true;
            this.game.setNPC(this);
            this.controller[4] = false;
            this.controller[5] = false;
            if (Bridge.referenceEquals(this.char, "suika")) {
                if (Math.random() < 0.1) {
                    this.model.scale = BNTest.GLVec3.op_Multiply$1(BNTest.GLVec3.getOne(), 5);
                    var csz = 10.0 * this.model.scale.x;
                    var hsz = csz / 2;
                    this.customBoundingBox = new BNTest.BoundingBox.$ctor1(new BNTest.GLVec3.ctor(-hsz, -csz, -hsz), new BNTest.GLVec3.ctor(hsz, csz, hsz));
                    this.setHitboxSize(hsz);
                    this.stepheight = 5 * this.model.scale.x;
                    this.defense = 6;
                    this.knockbackResistLevel = 3.0;
                } else {
                    this.model.scale = BNTest.GLVec3.op_Multiply$1(BNTest.GLVec3.getOne(), 0.8);
                    var csz1 = 8.0;
                    var hsz1 = csz1 / 2;
                    this.customBoundingBox = new BNTest.BoundingBox.$ctor1(new BNTest.GLVec3.ctor(-hsz1, -csz1, -hsz1), new BNTest.GLVec3.ctor(hsz1, csz1, hsz1));
                    this.setHitboxSize(hsz1);
                    this.stepheight = 5;
                    this.defense = 1;
                    this.knockbackResistLevel = 1;
                }
            }

        }
        if (!this.canRespawn) {
            this.alive = false;
        }
    },
    onKill: function (combatant) {
        //throw new NotImplementedException();
    }
    });

    Bridge.ns("BNTest.PlayerCharacter", $_);

    Bridge.apply($_.BNTest.PlayerCharacter, {
        f1: function (W) {
            return W.BNTest$IWeaponBehavior$getWeaponType() === 2;
        },
        f2: function (WB) {
            return WB.BNTest$IWeaponBehavior$getWeaponType() === 1;
        },
        f3: function (WB) {
            return WB.BNTest$IWeaponBehavior$getWeaponType() === 2;
        }
    });
});
