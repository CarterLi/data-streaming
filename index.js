/* global ResizeObserver */

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
  this.addItem = () => {
    this.items.push({ title: 'ESB', info: '转账', duration: 16 });
  };

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
    template: `
<div>
  <ul ng-repeat="line in chunks track by $index">
    <li ng-repeat="item in line">
      <header ng-bind="item.title"></header>
      <p>
        <i class="fa fa-wrench" aria-hidden="true"></i>
        <span ng-bind="item.info"></span>
      </p>
      <p>
        <i class="fa fa-clock-o" aria-hidden="true"></i>
        <span ng-bind="item.duration + ' ms'"></span>
      </p>
      <svg ng-if="$index < line.length - 1" width="85" height="11" class="jtk-connector">
        <path d="M 9.5 0 L 50.5 0 M 50.5 0 L 21.5 0 M 22 0 L 82 0" transform="translate(0,5.5)" fill="none" stroke="#61B7CF" style="" stroke-width="2" />
        <path d="M82,0 L71,5.5 L75.147,0 L71,-5.5 L82,0" stroke="#61B7CF" fill="#61B7CF" transform="translate(0,5.5)" />
      </svg>
      <svg ng-if="$index === line.length - 1" width="73" height="101.5" class="jtk-connector">
        <path d="M 10.5 0 L 51.5 0 M 51 0 L 65 0 M65 0 A 5 5 0 0,1 70 5 M 70 5 L 70 88 M70 88 A 5 5 0 0,1 65 93 M 65 93 L 10 93 " transform="translate(0,3)" fill="none" stroke="#61B7CF" stroke-width="2"></path>
        <path d="M10,93 L21,87.5 L16.853,93 L21,98.5 L10,93" class="" stroke="#61B7CF" fill="#61B7CF" transform="translate(0,3)"></path>
      </svg>
    </li>
  </ul>
</div>`,
    scope: {
      data: '=',
    },
    link(scope, element) {
      element = element[0];
      scope.chunks = [];

      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(([entry]) => {
          const width = entry.contentRect.width;
          scope.$apply(() => chunkItemsPerLine(width, scope.data, scope.chunks));
        });

        ro.observe(element);
        scope.$on('$destroy', () => ro.disconnect());
      } else {
        chunkItemsPerLine(element.clientWidth, scope.data, scope.chunks);
      }

      scope.$watchCollection('data', () => chunkItemsPerLine(element.clientWidth, scope.data, scope.chunks));
    }
  };
});
