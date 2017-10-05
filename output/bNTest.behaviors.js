Bridge.assembly("CoinDefender", function ($asm, globals) {
    "use strict";

    Bridge.define("BNTest.Behaviors.IceBall", {
        inherits: [BNTest.EntityBehavior,BNTest.IWeaponBehavior],
        active: false,
        ball: null,
        _ammo: 0,
        _maxAmmo: 1,
        _shotDelay: 0,
        _maxShotDelay: 4,
        _angle: 0,
        bulletSpeed: 2.0,
        bulletLifeSpan: 160,
        bulletGraphic: null,
        minCoolDown: 100,
        started: false,
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
        onAttacked: function (source) {
            var E = this.entity;
            //releases the ball.
            if (this.active && this.ball != null && this.ball.alive) {
                //accelerate on release.
                this.ball.speed = BNTest.GLVec3.op_Multiply$1(this.ball.speed, 1.1);
            }
            this.active = false;
        },
        update: function () {
            if (!this.started && this.bulletGraphic != null) {
                this.started = true;

                var pal = new (System.Collections.Generic.Dictionary$2(BNTest.GLColor,BNTest.GLColor))();
                var icecolor = new BNTest.GLColor(0.3, 0.3, 1);
                pal.set(new BNTest.GLColor(1, 0, 0), icecolor);
                pal.set(new BNTest.GLColor(1, 1, 1), icecolor);
                this.bulletGraphic.applyPalette(pal);
            }
            if (this.active) {
                if (!this.entity.controller[5]) {
                    if (this.ball != null && this.ball.alive) {
                        //accelerate on release.
                        this.ball.speed = BNTest.GLVec3.op_Multiply$1(this.ball.speed, 1.1);
                    }
                    this.active = false;
                    return;
                } else if (this.ball != null && this.ball.alive) {
                    this.ball.setScale(BNTest.GLVec3.op_Addition(this.ball.getScale(), BNTest.GLVec3.createUniform(0.1)));
                    this.ball.settouchDamage(this.ball.gettouchDamage()+0.5);

                    var sz = 11 * this.ball.getScale().x;
                    var HSZ = BNTest.GLVec3.createUniform(sz);
                    this.ball.customBoundingBox = new BNTest.BoundingBox.$ctor1(BNTest.GLVec3.op_Multiply$1(HSZ, -1), HSZ);

                    var SP = this.ball.speed.toVector2();
                    SP.normalize((this.ball.model.scale.x * 12));
                    this.entity.setx(this.ball.model.offset.x - SP.x);
                    this.entity.setz(this.ball.model.offset.z - SP.y);
                    //entity.As<PlayerCharacter>().forcedAngle = null;
                    //entity.As<PlayerCharacter>().FrictionActive = true;


                    return;
                }

            } else {
                this.entity.forcedAngle = null;
                this.entity.frictionActive = true;
            }
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
            this.active = true;
            //entity.PlaySound("pew");
            var spd = new BNTest.Vector2(evt.SX, evt.SZ);
            var P = new BNTest.Projectile(this.entity.world, this.entity);
            P.solid = false;
            var M = new BNTest.Model(this.entity.game);
            M.meshes.add(this.bulletGraphic);
            P.model = M;

            P.settouchDamage(20.0);

            P.speed = new BNTest.GLVec3.ctor(evt.SX, evt.SY, evt.SZ);
            P.obstruction = true;

            P.gravity = new BNTest.GLVec3.ctor(0, 0.12, 0);
            P.rotationSpeed = new BNTest.GLVec3.ctor(3.5, 0, 0);
            P.ifriction = 0.98;
            P.bounces = true;
            P.multiHit = true;
            P.knockbackPower = 6;
            //P.AddBehavior(new LifeSpan(P, 60));

            M.rotation.y = evt.A;

            //M.Rotation.X = 60;
            var sz = 11 * P.getScale().x;
            var HSZ = BNTest.GLVec3.createUniform(sz);
            M.customBoundingBox = new BNTest.BoundingBox.$ctor1(BNTest.GLVec3.op_Multiply$1(HSZ, -1), HSZ);
            P.customBoundingBox = M.customBoundingBox;

            P.setx(evt.X);
            P.sety(evt.Y + 2);
            P.setz(evt.Z);


            P.addBehavior(new BNTest.LifeSpan(P, this.bulletLifeSpan));

            this.entity.world.add(P);

            this.entity.forcedAngle = BNTest.MathHelper.radiansToDegrees(P.speed.toVector2().toAngle());
            this.entity.frictionActive = false;
            this.active = true;

        },
        fire: function (angle) {
            this._angle = angle;
            this._ammo = this._maxAmmo;
        }
    });
});
