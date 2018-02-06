# vue-music

利用 **`Vue 全家桶`** 仿原生 qq 音乐的 web 应用，基本完成大部分内容，搜索功能尚未完成。

# 技术栈

- vue-cli : vue 官方提供的脚手架工具完成开发，快速初始化项目
- vue-router : vue 官方提供的路由系统，简单快捷的创建单页面应用
- vuex : vue 官方提供的状态管理模式。集中式存储管理应用的所有组件的状态，非常便捷
- axios : vue 官方推荐的插件，在构建 SPA 应用使用 axios 进行 HTTP 操作
- 其他 : better-scroll 移动端的滚动插件(轮播、滚动及各式操作，功能强大)，vue-lazyload   实现图片的懒加载等

## 现有问题

- 打包的 dist 文件，原版作者的话:通过 jsonp 请求的数据会被正常渲染，而由于无 node 服务，通过 axios 请求的数据不会被正常渲染(虽然这么说了，但是我还是不太明白为何会这样o(╯□╰)o)
- 当选择随机播放模式，状态无法保存。当选择随机播放模式，退出界面后再次进入播放界面，虽然图标显示是随机模式，但依然是正常顺序模式。(原版是没有这个问题的，感谢哪位好心人指出)
- 初次打开应用，好像无法立即进行滚动，必须刷新一下才可以(代码问题 ??? 还是 better-scroll ??? )

## 关于 better-scroll
由于 better-scroll 更新太快，项目使用时是 1.6.3 版本(目前已更新到 1.8.0 )，新版本的写法有些不一样。

1. 关于轮播
  - 新版本中 **snap** 以对象的形式书写:
  ```    
   snap: {
          loop: true,
          threshold: 0.3, 
          speed: 400
        }  
  ```
  - 删除了之前**循环轮播 -1**的一个判断:
  ```
   if (this.loop) {
          pageIndex -= 1;
        }
  ```      
  - 在 1.6.3 的版本中会多出 2 个 dots，需要减去(官方给出的组件 demo 中是没有这个问题的，可能是 1.6.3 版本的问题，具体可以参考官方文档写法)  
  ```
   this.dots = new Array(this.children.length - 2)
  ```
  - 新版本提供了 this.slider.prev() 和 this.slider.next() 来实现图片的上下切换,自动轮播时调用this.slider.next()方法即可。
  ```
    新版本:
    _play() {
      //官方写法
      clearTimeout(this.timer); 
      this.timer = setTimeout(() => {
        this.slider.next();
      }, this.interval);
    }

    老版本:
    _play() {
      let pageIndex = this.currentPageIndex + 1;
      if (this.loop) {
         pageIndex += 1;
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval);
    }
  ```
2. 关于滚动
   不知道是不是因为版本更新,初始化时无法滚动，需要刷新一次才可以滚动操作。(可能是滚动的组件写法也更新了，因为我没有看过官方的滚动组件，所有不知道是哪里的问题，想知道的可以去看看官方的写法，看看是哪里的问题)

## 说明
  本项目基于某大神的chicken music

  
## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```


For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
