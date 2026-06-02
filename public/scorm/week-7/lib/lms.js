;(function(root) {
  var STORAGE_KEY = 'scorm_progress_week_7_xapi';

  function assign(target) {
    if (target == null) throw new TypeError('Cannot convert undefined or null to object');
    var output = Object(target);
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      if (source != null) {
        for (var key in source) {
          if (source.hasOwnProperty(key)) output[key] = source[key];
        }
      }
    }
    return output;
  }

  function debounce(fn, delay) {
    var timer = null;
    return function() {
      var ctx = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function() { fn.apply(ctx, args); }, delay);
    };
  }

  function getStorage() {
    try {
      var d = localStorage.getItem(STORAGE_KEY);
      return d ? JSON.parse(d) : {};
    } catch(e) { return {}; }
  }

  function setStorage(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
  }

  function lms() {
    var state = getStorage();
    var completedFn = function() { return false; };

    function GetDataChunk() { return state.suspend || ''; }
    function SetDataChunk(data) { state.suspend = data; setStorage(state); }
    function SetBookmark(data) {
      state.bookmark = data;
      setStorage(state);
    }
    function InitCompletion(fn) { completedFn = fn; }
    function SetScore(raw, max, min) { state.score = { raw: raw, max: max, min: min }; setStorage(state); }
    function SetPassed() { state.completed = true; state.passed = true; setStorage(state); }
    function SetFailed() { state.completed = true; state.passed = false; setStorage(state); }
    function FinishLesson() {}
    function ReportAnswer() {}
    function ConcedeControl() {}

    // Restore bookmark
    if (state.bookmark) {
      if (root.history.pushState) {
        root.history.pushState(null, null, state.bookmark);
      } else {
        root.location.hash = state.bookmark;
      }
    }

    // Load the course bundle
    setTimeout(function() { root.__loadEntry(); }, 0);

    return {
      SetBookmark: SetBookmark,
      SetDataChunk: SetDataChunk,
      GetDataChunk: GetDataChunk,
      FinishLesson: FinishLesson,
      InitCompletion: InitCompletion,
      ReportAnswer: ReportAnswer,
      SetFailed: SetFailed,
      SetPassed: SetPassed,
      SetScore: SetScore,
      ConcedeControl: ConcedeControl,
      utils: { assign: assign, debounce: debounce }
    };
  }

  root.lms = lms;
}(window));
