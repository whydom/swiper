<template>
  <div id="con-swiper" @touchstart='touchstar' @touchmove='touchmove' @touchend='touchend'>
    <!-- 显示图片的位置 -->
    <div id="swiper">
      <slot></slot>
    </div>

    <!-- 小圆点设置 -->
    <div id="indicator">
      <slot name="indicator" v-if="slidecount > 1">
        <div v-for="(itme, index) in slidecount" :key="index" class="indi-itme" :class="{active: index == currentindex - 1}"></div>
      </slot>
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

          // 判断是否是到结尾或者开头了
            // if(this.currentindex > this.slidecount){
            //   this.swiperstyle.transition = `transform 0s`
            //   this.settransform(0)
            //   this.currentindex = 1
            // }
            // if(this.currentindex < 0) {
            //   this.currentindex = this.slidecount + 1
            //   this.settransform(-this.currentindex * this.totalwidth)
            // }
            // console.log(this.currentindex);
            this.checkPosition()
          
        },3000)

        
      },

      // 关闭定时器
      stoptime() {
        window.clearInterval(this.timeplay)
      },

      /**
       * 校验正确的位置
       */
      checkPosition: function () {
        window.setTimeout(() => {
          // 1.校验正确的位置
          this.swiperstyle.transition = `transform 0s`
          if (this.currentindex >= this.slidecount + 1) {
            this.currentindex = 1;
            this.settransform(-this.currentindex * this.totalwidth);
          } else if (this.currentindex <= 0) {
            this.currentindex = this.slidecount;
            this.settransform(-this.currentindex * this.totalwidth);
          }

          // 2.结束移动后的回调
          this.$emit('transitionEnd', this.currentindex-1);
        }, 300)
      },

      // 滚动开始
      scrollContent(currentposition) {
        // 滚动状态为true
        this.scrolling = true
        // 设置滚动的过渡时间
        this.swiperstyle.transition = `transform 2s ease-in-out`
        // 滚动到合适的位置
        this.settransform(currentposition)
        // 滚动完成
        this.scrolling = false
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
      touchstar(event) {
        // 如果正在滚动，则不能拖动
        if(this.scrolling) {
          return
        }
        // 停止定时器
        this.stoptime()
        // 获取触摸时的坐标
        this.startx = event.touches[0].pageX
      },

      // 触摸中
      touchmove(event) {
        this.currentx = event.touches[0].pageX
        this.distance = this.currentx - this.startx
        let currentpic = (-this.currentindex * this.totalwidth)
        let moveposition = this.distance + currentpic
        this.swiperstyle.transition = `transform 0s`
        this.settransform(moveposition)
      },

      // 触摸结束
      touchend() {
        let currentmove = Math.abs(this.distance)
        if(this.distance == 0) {
          return
        }else if(this.distance > 0 && currentmove > this.totalwidth * 0.25) {
          this.currentindex--
        }else if(this.distance < 0 && currentmove > this.totalwidth * 0.25) {
          this.currentindex++
        }
        // 滚动到正确的位置
        this.scrollContent(-this.currentindex * this.totalwidth)
        // 重新开启定时器，定时器就是自动滚动
        this.starttime()
      },
      /**
       * 控制上一个, 下一个
       */
      previous: function () {
        this.changeItem(-1);
      },

      next: function () {
        this.changeItem(1);
      },

      changeItem: function (num) {
        // 1.移除定时器
        this.stopTimer();

        // 2.修改index和位置
        this.currentIndex += num;
        this.scrollContent(-this.currentIndex * this.totalWidth);

        // 3.添加定时器
        this.startTimer();
      }

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
  #indicator {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 8px;
    width: 100%;
    height: 8px;
    
  }
  #indicator > .indi-itme {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #fff;
    margin: 0 5px;
  }
  #indicator > .indi-itme.active {
    background-color: #f00;
  }
</style>