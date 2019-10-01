<template>
  <div class="cartcontrol">
    <!-- 商品减少按钮 -->
    <transition name="move">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decCount">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <!-- 商品数量 -->
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <!-- 商品增加按钮 -->
    <div class="cart-increase icon-add_circle" @click.stop.prevent="addCount"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
    export default {
        props: {
            food: {
                type: Object
            }
        },
        created () {
        },
        methods: {
          // 增加商品数量
          addCount (event) {
            if (!event._constructed) {
              return
            }
            // 判断当前food.count是否存在
            if (!this.food.count) {
              // 通过Vue.set添加变量可以被动态观测到
              Vue.set(this.food,'count',1)
            }else {
              this.food.count ++
            }
            // 提交获取按钮DOM的事件
            this.$emit('add', event.target)
          },
          // 减少商品数量
          decCount (event) {
            if (!event._constructed) {
              return
            }
            //判断foodCount是否大于0
            if (this.food.count>0){
              this.food.count --
            }
          }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0
    .cart-decrease, .cart-count, .cart-increase
      display inline-block
    .cart-decrease
      padding 6px
      transition all 0.4s linear
      opacity 1
      // 开启硬件加速，动画更流畅
      transform translate3d(0,0,0)
      .inner
        display inline-block
        line-height 24px
        font-size 24px
        color rgb(0,160,220)
        transition all 0.4s linear
        transform rotate(0)
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
      &.move-enter,&.move-leave-active
        opacity 0
        transform translate3d(24px,0,0)
        .inner
          transform rotate(180deg)
    .cart-count
      vertical-align top
      width 12px
      padding-top 6px
      line-height 24px
      text-align center
      font-size 10px
      color rgb(147,153,159)
    .cart-increase
      padding 6px
      line-height 24px
      font-size 24px
      color rgb(0,160,220)
    
</style>
