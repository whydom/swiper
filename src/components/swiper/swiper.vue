<template>
  <div id="con-swiper">
    <!-- 显示图片的位置 -->
    <div id="swiper">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        slidecount: 0,                //图片元素的个数
        totalwidth: 0,               //总宽度大小
        swiperstyle:{},              //swiper的样式
        currentindex: 1,              //当前索引值
        scrolling: false              //是否在滚动
      }
    },mounted() {
      setTimeout(() => {
        // 开启handleDom
        this.handleDom()
        // 在元素都挂载后开始执行定时器
        this.starttime()
      },3000)
      
    },
    methods: {

      // 定时器开始
      starttime() {
        this.timeplay = window.setInterval(() => {
          //让索引值自增
          this.currentindex++
          // 自动滚动开始,因为从右向左滚动，所以是负值,这个是让第二张图为首先显示，因为前后都插入了伪图
          this.scrollContent(-this.currentindex * this.totalwidth)
          if(this.currentindex > this.slidecount){
            this.currentindex = 0
            this.swiperstyle.transition = `transform 0s`
            this.settransform(-this.currentindex * this.totalwidth)
          }
          if(this.currentindex < 0) {
            this.currentindex = this.slidecount + 1
            this.settransform(-this.currentindex * this.totalwidth)
          }
          console.log(this.currentindex);
        },3000)

        
      },

      // 关闭定时器
      stoptime() {
        window.clearInterval(this.timeplay)
      },

      // 滚动开始
      scrollContent(currentposition) {
        // 滚动状态为true
        this.scrolling = true
        // 设置滚动的过渡时间
        this.swiperstyle.transition = `transform 3s`
        // 滚动到合适的位置
        this.settransform(currentposition)
      },

      // 设置滚动位置
      settransform(position) {
        this.swiperstyle.transform = `translate(${position}px, 0)`
        this.swiperstyle['-webkit-transform'] = `translate(${position}px, 0)`
        this.swiperstyle['-ms-transform'] = `translate(${position}px, 0)`
        console.log('this.swiperstyle.transform=' +this.swiperstyle.transform);
      },

      // 在首尾添加slide的图片
      handleDom() {
        const swiper = document.getElementById('swiper')
        // 获取slide的数量
        const slideNode = swiper.getElementsByClassName('slide')
        // 获取图片的个数
        this.slidecount = slideNode.length
        // 当图片元素slide的数量大于1的时候，需要在图片整体中前面加一张最后的图片，图片末尾加一张首页的图片，这样就会造成循环假象
        if(this.slidecount > 1) {
          // 拿到首图
          let slidefirst = slideNode[0].cloneNode(true)
          // 拿到尾图
          let slideend = slideNode[slideNode.length - 1].cloneNode(true)
          // 在图片元素整体插入末尾图片在第一位(insertBefore与appendChild方法都是在父元素中使用)
          swiper.insertBefore(slideend,slideNode[0])
          // 在图片元素整体插入一个首图在最后一位中
          swiper.appendChild(slidefirst)
          // 获取整体图片元素的宽度
          this.totalwidth = swiper.offsetWidth
          //拿到swiper的样式方法
          this.swiperstyle = swiper.style

          // 首张展示的图
          this.settransform(-this.totalwidth)

          // 测试输出一下数据
          console.log('slidecount=' + this.slidecount);
          console.log('totalwidth=' + this.totalwidth);
        }

      },

      // 拖动图片
      // 触摸开始
      // touchstar(event) {
      //   // 如果正在滚动，则不能拖动
      //   if(this.scrolling) {
      //     return
      //   }
      //   this.startx = event.touches[0].pageX
      // },

      // // 触摸中
      // touchmove(event) {
      //   this.currentx = event.touches[0].pageX
      //   this.distance = this.currentx - this.startx
      //   // 利用transform的translate属性改为swiper的
      //   this.swiperstyle.transform = `translate(${this.distance}px, 0)`
      // }

    },
  }
</script>
<style scoped>
  #con-swiper {
    position: relative;
    overflow: hidden;
  }
  #swiper {
    display: flex;
  }
</style>