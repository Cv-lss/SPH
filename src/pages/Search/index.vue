<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <li class="with-x" v-if="searchParams.categoryName">{{ searchParams.categoryName }}<i
                @click="removeCategoryName">×</i></li>
            <li class="with-x" v-if="searchParams.keyword">{{ searchParams.keyword }}<i @click="removeKeyWord">×</i>
            </li>
            <li class="with-x" v-if="searchParams.trademark">{{ searchParams.trademark.split(':')[1] }}<i
                @click="removetrademark">×</i>
            </li>
            <li class="with-x" v-for="attrValue, index in searchParams.props" :key="index">{{ attrValue.split(':')[1]
            }}<i @click="removeattr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrsInfo="attesInfo" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{ active: isOne }" @click="changeOrder('1')">
                  <a>综合<span v-show="isOne" class="iconfont" :class="{ 'icon-up': isAsc, 'icon-down': isDesc }"></span>
                  </a>
                </li>
                <li :class="{ active: isTwo }" @click="changeOrder('2')">
                  <a>价格<span v-show="isTwo" class="iconfont" :class="{ 'icon-up': isAsc, 'icon-down': isDesc }"></span>
                  </a>
                </li>

              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`"><img :src="good.defaultImg" /></router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">{{
                        good.title
                    }}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>

            </ul>
          </div>
          <!-- 分页器 -->
          <Pagination :pageNoe="searchParams.pageNo" :pageSize="searchParams.pageSize" :total="total" :continues="5"
            @getPageNo="getPageNo"></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from './SearchSelector/SearchSelector'
import { mapGetters } from 'vuex'

import Pagination from '../../components/Pagination/index.vue'
export default {
  name: 'Search',

  components: {
    SearchSelector,
    Pagination
  },

  data() {
    return {
      flag: false,
      //带给服务器的参数
      searchParams: {
        //一级分类
        category1Id: "",
        //二级分类
        category2Id: "",
        //三级分类
        category3Id: "",
        //分类名字
        categoryName: "",
        //关键字
        keyword: "",
        //排序
        order: "1:desc",
        //分页器 代表当前是几页
        pageNo: 1,
        //代表每一个展示的个数
        pageSize: 3,
        //平台售卖属性带的参数
        props: [],
        //品牌
        trademark: ""
      }

    }
  },

  //当组件挂载完毕先执行一次 {在mounted之前}
  beforeMount() {
    //ES6新增的语法 合并对象 第一个参数是要合并到的对象 
    Object.assign(this.searchParams, this.$route.query, this.$route.params)
  },



  mounted() {
    //组件挂载完调用这个函数请求服务器
    this.getData()
    // console.log(this.goodsList);
  },

  methods: {
    //把这个请求封装成一个函数 当需要的时候调用
    getData() {
      this.$store.dispatch('getSearchList', this.searchParams)
    },
    //删除面包屑分类的名字
    removeCategoryName() {
      //如果把空字符串变为undefined 不会带给服务器 
      this.searchParams.categoryName = undefined
      this.searchParams.category1Id = undefined
      this.searchParams.category2Id = undefined
      this.searchParams.category3Id = undefined
      this.getData()
      //地址栏也需要改
      if (this.$route.params) {
        this.$router.push({ name: 'search', params: this.$route.params })
      }
    },
    //删除面包屑关键字的名字
    removeKeyWord() {
      //给服务器带的参数searchParams的keyword置空
      this.searchParams.keyword = undefined
      //再次发送请求
      this.getData()
      //通知兄弟组件清空搜索框的 keyword
      this.$bus.$emit('clear')

      //判断有没有query参数
      if (this.$route.query) {
        this.$router.push({ name: 'search', query: this.$route.query })
      }
    },
    //自定义事件回调
    trademarkInfo(trademark) {
      //整理品牌的参数 ID:名称
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
      //再次发送请求
      this.getData()
    },
    //删除品牌
    removetrademark() {
      this.searchParams.trademark = undefined
      //再次发送请求
      this.getData()
    },
    //收集平台属性的回调函数 （自定义属性）
    attesInfo(attrs, attrValue) {
      // console.log(attrs, attrValue);
      //整理数据
      let props = `${attrs.attrId}:${attrValue}:${attrs.attrName}`
      //数组去重 判断有没有这个数组 不去重会一直可以点击属性
      if (this.searchParams.props.indexOf(props) == -1) {
        this.searchParams.props.push(props)
      }
      //再次请求服务器
      this.getData()
    },
    //删除售卖的属性
    removeattr(index) {
      // alert(111)
      // console.log(index);
      //整理要删除的当前数组索引值
      this.searchParams.props.splice(index, 1)
      //再次发送请求
      this.getData()
    },



    //判断用户点击的是升序还是降序
    changeOrder(flag) { //接收的是一个标记 综合是1 价格是 2
      // console.log(flag);
      let originOrder = this.searchParams.order;
      let originFlag = this.searchParams.order.split(':')[0] //截取这个方便下面判断 
      // console.log(originFlag);
      let originShot = this.searchParams.order.split(':')[1]
      // console.log(originShot);
      let newOrder = ''
      if (flag == originFlag) {  //如果接收的参数等于截取的参数就可以判断用户点击的是哪里了
        newOrder = `${originFlag}:${originShot == 'desc' ? 'asc' : 'desc'}`
      } else {
        newOrder = `${flag}:${'desc'}`
      }
      //将新获取的值给order
      this.searchParams.order = newOrder
      //再次发起请求
      this.getData()
    },

    //自定义事件 分页器
    getPageNo(pageNo) {
      // console.log(pageNo);
      //整理带给服务器的参数
      this.searchParams.pageNo = pageNo

      //再次发起请求
      this.getData()
    }
  },

  computed: {
    ...mapGetters(['goodsList', 'total']),

    isOne() {
      return this.searchParams.order.indexOf('1') != -1
    },
    isTwo() {
      return this.searchParams.order.indexOf('2') != -1
    },
    isAsc() {
      return this.searchParams.order.indexOf('asc') != -1
    },
    isDesc() {
      return this.searchParams.order.indexOf('desc') != -1
    },



  },

  watch: { //监听数据
    $route(newValue, oldValue) {// 因为mounted只能发起一次请求 用户搜索的时候就不在发送请求 所以需要监听路由的变化来发送请求
      //再次请求之前要把用户搜索的参数带给服务器
      Object.assign(this.searchParams, this.$route.query, this.$route.params)
      //再次发起请求
      this.getData()
      //每一次请求完应该置空 让下一次接受响应的id
      this.searchParams.category1Id = ''
      this.searchParams.category2Id = ''
      this.searchParams.category3Id = ''
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>