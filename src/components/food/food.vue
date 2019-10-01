<template>
  <div>
    <transition name="move">
      <div v-show="showFlag" class="food" ref="food">
        <!--商品详情-->
        <div class="food-content">
          <!--商品图片-->
          <div class="image-header">
            <img :src="food.image">
            <!--返回按钮-->
            <div class="back" v-on:click="hide">
              <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <!--商品内容-->
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <!--商品详情-->
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <!--商品价格-->
            <div class="price">
              <span class="now">￥{{food.price}}</span>
              <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <!--按钮组件-->
            <div class="cartcontrol-wrapper">
              <cartcontrol @add="addFood" :food="food"></cartcontrol>
            </div>
            <!--加入购物车组件-->
            <transition name="fade">
              <div @click.stop.prevent="addFirst(food,$event)" class="buy" v-show="!food.count || food.count===0">加入购物车
              </div>
            </transition>
          </div>
          <!--split-->
          <split v-show="food.info"></split>
          <!--商品介绍-->
          <div class="info" v-show="food.info">
            <h1 class="title">商品介绍</h1>
            <p class="text">{{food.info}}</p>
          </div>
          <!--split-->
          <split></split>
          <!--商品评价-->
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <!--评价模块-->
            <ratingselect @ratingtype="selectRatingType" @contentToggle="selectContentToggle"
                          :select-type="selectType" :only-content="onlyContent"
                          :desc="desc" :ratings="food.ratings">
            </ratingselect>
            <!--评价列表-->
            <div class="rating-wrapper">
              <ul v-show="food.ratings && food.ratings.length">
                <li
                    v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings"
                     class="rating-item border-1px">
                  <!--用户数据-->
                  <div class="user">
                    <span class="name">{{rating.username}}</span><img class="avatar" width="12" height="12" :src="rating.avatar">
                  </div>
                  <!--评论时间-->
                  <div class="time">{{rating.rateTime | formatDate}}</div>
                  <!--评论内容-->
                  <p class="text">
                    <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span><span>{{rating.text}}</span>
                  </p>
                </li>
              </ul>
              <!--暂无评价-->
              <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
            </div>
            
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import cartcontrol from '../cartcontrol/cartcontrol'
  import Vue from 'vue'
  import split from '../split/split'
  import ratingselect from '../ratingselect/ratingselect'
  import {formatDate} from '../../common/js/date'
  
  const ALL = 2
  
  export default {
    props: {
      food: {
        type: Object
      },
    },
    data() {
      return {
        showFlag: false,
        selectType: 2,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    methods: {
      // 显示商品详情页
      show () {
        // 初始化组件
        this.showFlag = true
        this.selectType = 2
        this.onlyContent = false
        
        // 添加better-scroll
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        })
      },
      // 隐藏商品详情页
      hide() {
        this.showFlag = false
      },
      // 添加商品
      addFirst(food,event) {
        if (!event._constructed) {
          return
        }
        console.log(event.target)
        // 提交获取按钮DOM
        this.$emit('add', event.target)
        Vue.set(this.food,'count',1)
      },
      addFood(target) {
        this.$emit('add',target)
      },
      //显示评论
      needShow (type,text) {
        //是否要显示有内容的评论
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      },
      selectRatingType(type) {
        this.selectType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      selectContentToggle(content) {
        this.onlyContent = content
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      }
    },
    events: {
      // 接收cartcontrol传来的事件
      'add' (target) {
        this._drop(target)
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date,'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  
  .food
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 30
    width 100%
    background-color #fff
    transform translate3d(0,0,0)
    transition all 0.2s linear
    &.move-enter,&.move-leave-active
      transform translate3d(100%,0,0)
    .image-header
      position relative
      width 100%
      height 0
      padding-top 100%
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 10px
          font-size 20px
          color #fff
    .content
      position relative
      padding 18px
      .title
        line-height 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700
        color rgb(7,17,27)
      .detail
        margin-bottom 18px
        line-height 10px
        font-size 0
        height 10px
        .sell-count,.rating
          font-size 10px
          color rgb(147,153,159)
        .sell-count
          margin-right 12px
      .price
        font-weight 700
        line-height 24px
        padding-top 5px
        .now
          margin-right 18px
          font-size 14px
          color rgb(240, 20, 20)
        .old
          text-decoration line-through
          font-size 10px
          color rgb(147, 153, 159)
      .cartcontrol-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: 10px
        color: #fff
        background: rgb(0, 160, 220)
        transition all 0.2s
        opacity 1
        &.fade-enter,&.fade-leave-active
          opacity 0
          z-index -1
    .info
      padding 18px
      .title
        margin-bottom 6px
        line-height 14px
        font-size 14px
        font-weight 500
        color #07111b
      .text
        padding 0 8px
        font-size 12px
        line-height 24px
        font-weight 200
        color rgb(77,85,93)
    .rating
      padding-top 18px
      padding-bottom 12px
      .title
        padding-left 18px
        line-height 14px
        font-size 14px
        font-weight 500
        color #07111b
      .rating-wrapper
        padding 0 18px
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7,17,27,0.1))
          &:last-child {
            border-none();
          }
          .user
            position absolute
            right 0
            top 16px
            font-size 0
            line-height 12px
            .name
              display inline-block
              vertical-align top
              margin-right 6px
              font-size 10px
              color rgb(147,153,159)
            .avatar
              border-radius 50%
          .time
            margin-bottom 6px
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
          .text
            line-height 16px
            font-size 12px
            color rgb(7,17,27)
            .icon-thumb_up,.icon-thumb_down
              margin-right 6px
              line-height 16px
              font-size 12px
            .icon-thumb_up
              color rgb(0,160,220)
            .icon-thumb_down
              color rgb(147,153,159)
        .no-rating
          padding 16px 0
          font-size 12px
          color rgb(147,153,159)
</style>
