<template>
  <div class="ratingselect">
    <!--评价类型-->
    <div class="rating-type border-1px">
      <!--方块样式-->
      <span @click="select(2,$event)" class="block positive" :class="{'active':type === 2}">{{desc.all}}<span
        class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{'active':type === 0}">{{desc.positive}}<span
        class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active':type === 1}">{{desc.negative}}<span
        class="count">{{negatives.length}}</span></span>
    </div>
    <!--只看有内容的评论-->
    <div @click="toggleContent($event)" class="switch" :class="{'on':content === true}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  
  export default {
    props: {
      // 评价内容
      ratings: {
        type: Array,
        default() {
          return []
        }
      },
      // 评价类型
      selectType: {
        type: Number,
        default: 2
      },
      // 只看有内容的评价
      onlyContent: {
        type: Boolean,
        default: false
      },
      // 评价描述
      desc: {
        type: Object,
        default () {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    data () {
      return {
        type: this.selectType,
        content: this.onlyContent
      }
    },
    computed: {
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === 0
        })
      },
      negatives () {
        return this.ratings.filter((rating) => {
          return rating.rateType === 1
        })
      }
    },
    methods: {
      // 方块点击事件
      select(type,event) {
        if (!event._constructed) {
          return
        }
        this.type = type
        // 派发一个事件,让父组件监听
        this.$emit('ratingtype',type)
      },
      // 图标点击事件
      toggleContent(event) {
        if (!event._constructed) {
          return
        }
        this.content = !this.content
        // 让父组件监听事件
        this.$emit('contentToggle',this.content)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  
  .ratingselect
    .rating-type
      padding 18px 0
      margin 0 18px
      border-1px(rgba(7,17,27,0.1))
      font-size 0
      .block
        display inline-block
        padding 8px 12px
        margin-right 8px
        border-radius 1px
        font-size 12px
        color rgb(77,85,93)
        &.active
          color #fff
        .count
          margin-left 2px
          line-height 8px
          font-size 8px
        &.positive
          background-color rgba(0,160,220,0.2)
          &.active
            background-color rgba(0,160,220,1)
        &.negative
          background-color rgba(77,85,93,0.2)
          &.active
            background-color rgb(77,85,93)
    .switch
      padding 12px 18px
      line-height 24px
      border-bottom 1px solid rgba(7,17,27,0.1)
      color rgb(147,153,159)
      font-size 0
      &.on
        .icon-check_circle
          color #00c850
      .icon-check_circle
        display inline-block
        vertical-align top
        margin-right 4px
        font-size 24px
      .text
        display inline-block
        vertical-align top
        font-size 12px
</style>
