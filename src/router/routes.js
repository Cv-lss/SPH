//路由配置信息

//引入路由组件
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import PaySuccess from '@/pages/PaySuccess'
import Center from '@/pages/Center'
import groupOrder from '@/pages/Center/groupOrder'
import myOrder from '@/pages/Center/myOrder'
// console.log(VueRouter);


export default [
    {
        path: '/center',
        component: Center,
        meta: { show: true }, //配置路由元信息 来判断footer显示和隐藏
        //二级路由组件
        children: [
            {

                path: 'grouporder',
                component: groupOrder
            },
            {
                path: 'myorder',
                component: myOrder
            },
            {
                path: '/center',
                redirect: '/center/myorder'
            }
        ]
    },
    {
        path: '/paysuccess',
        component: PaySuccess,
        meta: { show: true } //配置路由元信息 来判断footer显示和隐藏
    },
    {
        path: '/pay',
        component: Pay,
        meta: { show: true },//配置路由元信息 来判断footer显示和隐藏

    },
    {
        path: '/trade',
        component: Trade,
        meta: { show: true }, //配置路由元信息 来判断footer显示和隐藏
        //路由独享守卫
        beforeEnter: (to, from, next) => {
            // reject the navigation
            if (from.path == '/shopcart') {
                next()
            } else {
                next(false)
            }
        },
    },
    {
        path: '/shopcart',
        component: ShopCart,
        meta: { show: true } //配置路由元信息 来判断footer显示和隐藏
    },
    {
        path: '/addcartsuccess',
        component: AddCartSuccess,
        name: 'addcartsuccess',
        meta: { show: true } //配置路由元信息 来判断footer显示和隐藏
    },
    {
        path: '/detail/:skuid',  //要带参数 所以要占位skuid
        component: Detail,
        meta: { show: true } //配置路由元信息 来判断footer显示和隐藏
    },
    {
        path: '/home',
        component: Home,
        meta: { show: true } //配置路由元信息 来判断footer显示和隐藏
    },
    {
        path: '/search/:keyword?',
        component: Search,
        meta: { show: true },
        name: 'search',
        //路由是可以给组件传递props的
        //函数写法才是最重要的
        props: (route) => ({
            keyword: route.params.keyword,
            big: route.query.big
        })
    },
    {
        path: '/login',
        component: Login,
        meta: { show: false },
    },
    {
        path: '/register',
        component: Register,
        meta: { show: false },
    },
    { //重定向 当项目跑起来的时候 访问网页 应该显示的是首页
        path: '*',
        redirect: '/home'
    }
]