angular.module('app', [])
.controller('RootController', function ($scope) {
  this.items = [
    { title: '柜面', info: '转账', duration: 16 },
    { title: 'ESB', info: '个人身份校验校验', duration: 16 },
    { title: '核心系统', info: '用户信息查询', duration: 16 },
    { title: 'ESB', info: '用户信息查询', duration: 16 },
    { title: '核心系统', info: '用户信息查询', duration: 16 },
    { title: 'ESB', info: '转账', duration: 16 },
    { title: '支付', info: '转账', duration: 16 },
    { title: '综合柜面', info: '转账', duration: 16 },
    { title: 'ESB', info: '用户信息查询', duration: 16 },
    { title: '核心系统', info: '用户信息查询', duration: 16 },
    { title: 'ESB', info: '转账', duration: 16 },
  ];
  this.chunks = [];
})
.directive('dataStreaming', function () {
  /**
   * @param {any[]} arr
   * @param {number} n
   */
  function chunk(arr, n) {
    return Array.from(Array(Math.ceil(arr.length / n)), (_, i) => arr.slice(i * n, i * n + n));
  }

  /**
   * @param {number} lineWidth
   * @param {any[]} src
   * @param {any[]} target
   */
  function chunkItemsPerLine(lineWidth, src, target) {
    const count = (lineWidth - 72) / (145 + 72) | 0;
    target.length = 0;
    target.push(...chunk(src, count));
  }

  return {
    restrict: 'E',
    scope: {
      src: '=',
      target: '=',
    },
    link(scope, element, attrs) {
      element = element[0];
      if (typeof ResizeObserver !== undefined) {
        const ro = new ResizeObserver( ([entry]) => {
          const width = entry.contentRect.width;
          scope.$parent.$applyAsync(() => {
            chunkItemsPerLine(width, scope.src, scope.target);
          });
        });

        ro.observe(element);
        scope.$on('$destroy', () => ro.disconnect());
      } else {
        chunkItemsPerLine(element.clientWidth, scope.src, scope.target);
      }
    }
  };
});
