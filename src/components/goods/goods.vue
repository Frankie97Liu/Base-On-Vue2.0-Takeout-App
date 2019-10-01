<template>
  <div>
    <div class="goods">
      <!--左侧菜单-->
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li
            v-for="(item,index) in goods"
            class="menu-item"
            :class="{'current':currentIndex === index}"
            @click="selectMenu(index,$event)"
          >
            <span class="text border-1px">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
              {{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <!--右侧商品列表-->
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <!-- 商品详情 -->
          <li v-for="item in goods" class="food-list" ref="foodlist">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <!-- 食物详情 -->
              <li @click="clickFood(food,$event)" v-for="food in item.foods" class="food-item border-1px" >
                <!--图片-->
                <div class="icon">
                  <img width="57" height="57" style="border-radius: 3px" :src="food.icon" />
                </div>
                <!--内容-->
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <!-- 描述 -->
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <!-- 价格 -->
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <!-- 商品数量选择按钮 -->
                  <div class=cartcontrol-wrapper>
                    <cartcontrol @add="addFood" :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!--购物车-->
      <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    </div>
    <!--商品详情页-->
    <food :food="answerFood" ref="foods"></food>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll"
import shopcart from "../shopcart/shopcart"
import cartcontrol from "../cartcontrol/cartcontrol"
import food from '../food/food'

const ERR_OK = 0;
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      answerFood: {
      
      }
    };
  },
  computed: {
    // 返回当前商品区
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          // 返回当前索引
          return i;
        }
      }
      return;
    },
    // 找到被选择的food
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created() {
    // 通过AJax请求拿到goods数据
    this.$http.get("/api/goods").then(response => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.goods = response.data;
        this.$nextTick(() => {
          this._initScroll();
          this.calculateHeight();
        });
      }
    })
    this.classMap = ["guarantee", "discount", "decrease", "invoice", "special"]
  },
  methods: {
    // 初始化滚动
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        // 实时监听到位置
        probeType: 3
      });
      this.foodsScroll.on("scroll", pos => {
        // 实时拿到ScrollY的位置
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    // 计算高度
    calculateHeight() {
      let foodList = this.$refs.foodlist;
      let height = 0;
      // 初始化listHeight高度
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        // 拿到每一个foodList元素的高度
        height += item.clientHeight;
        // 将得到的height push 到listHeight
        this.listHeight.push(height);
      }
    },
    // 菜单点击按钮事件
    selectMenu(index, event) {
      if (!event._constructed) {
        return;
      }
      let foodList = this.$refs.foodlist;
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el, 300);
    },
    // 执行下落动画
    _drop(target) {
      // 异步执行动画， 体验优化
      this.$nextTick(() => {
        // 接收shopcart的drop方法
        this.$refs.shopcart.drop(target)
      })
    },
    addFood (target) {
      this._drop(target)
    },
    // 商品点击按钮
    clickFood(food, event) {
      if (!event._constructed) {
        return
      }
      this.answerFood = food
      // 调用food实例方法
      this.$refs.foods.show()
    }
  },
  events: {
    // 接收cartcontrol传来的事件
    'add' (target) {
      this._drop(target)
    }
  },
  components: {
    cartcontrol,
    shopcart,
    food
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';

.goods {
  display: flex;
  position: absolute;
  top: 174px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;

  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background-color: #f3f5f7;

    .menu-item {
      display: table;
      height: 54px;
      width: 56px;
      line-height: 14px;
      font-size: 14px;
      padding: 0 8px;

      &.current {
        position: relative;
        margin-top: -1px;
        z-index: 10;
        background-color: white;
        font-weight: 700;

        .text {
          border-none();
        }
      }

      .icon {
        display: inline-block;
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;

        &.decrease {
          bg-img('decrease_3');
        }

        &.discount {
          bg-img('discount_3');
        }

        &.guarantee {
          bg-img('guarantee_3');
        }

        &.invoice {
          bg-img('invoice_3');
        }

        &.special {
          bg-img('special_3');
        }
      }

      .text {
        display: table-cell;
        width: 56px;
        vertical-align: middle;
        border-1px(rgba(7, 17, 27, 0.1));
        font-size: 12px;
      }
    }
  }

  .foods-wrapper {
    flex: 1;

    .title {
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background-color: #f3f5f7;
    }

    .food-item {
      display: flex;
      margin: 18px;
      padding-bottom: 16px;
      border-1px(rgba(7, 17, 27, 0.1));

      &:last-child {
        border-none();
        margin-bottom: 0;
      }

      .icon {
        flex: 0 0 57px;
        margin-right: 10px;
      }

      .content {
        flex: 1;

        .name {
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 14px;
          font-size: 14px;
          font-weight: bold;
          color: rgb(7, 17, 27);
        }

        .desc, .extra {
          line-height: 12px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .desc {
          margin-bottom: 8px;
        }

        .extra {
          .count {
            margin-right: 12px;
          }
        }

        .price {
          font-weight: 700;
          line-height: 24px;
          padding-top: 5px;
  
          .now {
            margin-right: 18px;
            font-size: 14px;
            color: rgb(240, 20, 20);
          }
  
          .old {
            text-decoration: line-through;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }
        .cartcontrol-wrapper {
          position absolute
          right 0
          bottom 12px
        }
        
      }
    }
  }
}
</style>
