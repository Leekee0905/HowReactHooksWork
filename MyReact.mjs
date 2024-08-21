let hooks = [], // hook을 관리하는 배열
  currentHook = 0; // hook의 현재 인덱스

const MyReact = {
  render(Component) {
    const Comp = Component();
    Comp.render();
    currentHook = 0;
    return Comp;
  },
};

const useState = (initialValue) => {
  hooks[currentHook] = hooks[currentHook] || initialValue; //현재 훅에 존재하는 값을 꺼내오던가 initialValue를 할당
  const hookIndex = currentHook;
  const setState = (newState) => {
    if (typeof newState === "function") {
      // 입력 받은 newState의 타입이 함수인지 확인하고 함수이면 함수형 업데이트 진행
      hooks[hookIndex] = newState(hooks[hookIndex]);
    } else {
      hooks[hookIndex] = newState; // 아니라면 일반 상태 업데이트
    }
  };
  return [hooks[currentHook++], setState]; //hooks에 존재하는 상태 및 다음 hook을 위한 인덱스 증가
};
const useEffect = (callback, depArray) => {
  const hasNoDeps = !depArray; //의존성 배열 여부
  const prevDeps = hooks[currentHook] ? hooks[currentHook].deps : undefined; // 이전 의존성 배열 체크
  const prevCleanUp = hooks[currentHook]
    ? hooks[currentHook].cleanUp
    : undefined; // 이전 클린업 함수 체크

  const hasChangedDeps = prevDeps
    ? !depArray.every((el, i) => el === prevDeps[i])
    : true; // 의존성 배열이 변경되었는지 확인, 같지않다면 callback을 실행시키고 _deps를 유저의 의존성배열로 치환시켜줌

  if (hasNoDeps || hasChangedDeps) {
    if (prevCleanUp) prevCleanUp(); // 이전 클린업함수가 있다면 그거로 실행
    const cleanUp = callback();
    hooks[currentHook] = { deps: depArray, cleanUp };
  }
  currentHook++; // 다음 훅으로 넘어가기
};
MyReact.useState = useState;
MyReact.useEffect = useEffect;

export { useState, useEffect };
export default MyReact;
