const prefix = "blog"

const _storage = {
  get theme() {
    return localStorage.getItem(`${prefix}_theme`)
  },
  set theme(v: string | null) {
    if (v) localStorage.setItem(`${prefix}_theme`, v)
    else localStorage.removeItem(`${prefix}_theme`)
  },
}

export default _storage
