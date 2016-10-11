Bridge.assembly("BNTest", function ($asm, globals) {
    "use strict";

    Bridge.define("BNTest.Behaviors.LifeSpan", {
        inherits: [BNTest.EntityBehavior],
        HP: 0,
        ctor: function (entity, HP) {
            this.$initialize();
            BNTest.EntityBehavior.ctor.call(this, entity);
            this.HP = HP;
        },
        update: function () {
            this.HP = (this.HP - 1) | 0;
            if (this.HP <= 0) {
                this.entity.alive = false;
            }
            BNTest.EntityBehavior.prototype.update.call(this);
        }
    });
});
