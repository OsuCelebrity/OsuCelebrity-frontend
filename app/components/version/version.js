'use strict';

angular.module('osuCelebrity.version', [
  'osuCelebrity.version.interpolate-filter',
  'osuCelebrity.version.version-directive'
])

.value('version', '0.1');
