<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
@import "uview-plus/index.scss";

.uni-tabbar {
  background-color: white !important;
  border-top: 1px solid rgba($color: #808080, $alpha: .1) !important;
  // border-color: rgba($color: #808080, $alpha: .6) !important;
}
</style>
