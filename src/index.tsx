import React from 'react';
import { SyncRequestError, PromiseResolveType, LazyReturn } from './type';

const _FETCH_INNER_ERROR = Symbol('_FETCH_INNER_ERROR')

window.onerror = function(
  _event: Event | string, 
  _source?: string, 
  _lineno?: number, 
  _colno?: number, 
  error?: SyncRequestError<Promise<React.ReactNode>>) {
  if (error.$$type ===  _FETCH_INNER_ERROR) {
    return true
  }else{
    return false
  }
} as any as OnErrorEventHandler

function Lazy (promise: LazyReturn<React.ReactNode>) {
  return class _Lazy extends React.PureComponent {
    componentDidMount() {
      // eslint-disable-next-line
      throw {
        handler: promise instanceof Function ? promise() : promise,
        $$type: _FETCH_INNER_ERROR
      }
    }

    render() {
      return null
    }
  }
}

class Suspense extends React.PureComponent<{
  fallback: React.ReactNode
}, {
  loading: boolean,
  el: React.ReactNode | null,
  _children: React.ReactNode | null
}, {}> {
  state = {
    loading: false,
    el: null,
    _children: null
  }
  now = null

  componentDidCatch(e: any) {
    this.now = Date.now()
    let now = this.now
    e.handler.then((res: PromiseResolveType) => {
      if (now === this.now) {
        this.setState({
          el: res.default ? res.default() : res
        })
      }
    }).finally(() => {
      if (this.now === now) {
        this.setState({
          loading: false
        })
      }
    }) 
  }
  componentDidMount() {
    this.setState({
      _children: this.props.children,
    })
  }

  componentDidUpdate() {
    this.setState({
      _children: this.props.children,
    })
  }

  static getDerivedStateFromError() {
    return {
      loading: true
    }
  }

  render() {
    const {el, loading, _children} = this.state
    const {fallback, children} = this.props

    return <>
      {loading ? fallback : el}
      {_children !== children && children}
    </>
  }
}

export function syncFetch(promise: Promise<React.ReactNode>, fallback: React.ReactNode) {
  const Fetch = Lazy(() => promise)

  return <Suspense fallback={fallback}>
    <Fetch />
  </Suspense>
}
