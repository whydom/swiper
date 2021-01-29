<template>
  <swiper>
    <swiperitme v-for="(itme, id) in pic" :key="id">
      <img :src="itme.image" alt="">
    </swiperitme>
  </swiper>
</template>

<script>
import swiper from 'components/swiper/swiper'
import swiperitme from 'components/swiper/swiperitme'
import pic1 from 'assets/img/1.jpg'
import pic2 from 'assets/img/2.jpg'
import pic3 from 'assets/img/3.jpg'
import pic4 from 'assets/img/4.jpg'

export default {
  name: 'App',
  data() {
    return {
      pic: [
        {
          image:pic1
        },
        {
          image:pic2
        },
        {
          image:pic3
        },
        {
          image:pic4
        },
        
      ]
    }
  },
  components: {
    swiper,
    swiperitme
  }
}
</script>

<style>
   
</style>
