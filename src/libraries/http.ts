// import configProject from '@/config/configService'

// import { LoginResType } from '@/schemaValidations/auth.schema'
// import Cookies from 'js-cookie'
// type CustomOptions = Omit<RequestInit, 'method'> & {
//   baseUrl?: string | undefined
// }

// const ENTITY_ERROR_STATUS = 422
// const AUTHENTICATION_ERROR_STATUS = 401

// export class HttpError extends Error {
//   status: number
//   payload: {
//     message: string
//     [key: string]: any
//   }
//   constructor({
//     status,
//     payload,
//     message = 'Lỗi HTTP'
//   }: {
//     status: number
//     payload: any
//     message?: string
//   }) {
//     super(message)
//     this.status = status
//     this.payload = payload
//   }
// }

// let clientLogoutRequest: null | Promise<any> = null
// const isClient = typeof window !== 'undefined'
// const request = async <Response>(
//   method: 'GET' | 'POST' | 'PUT' | 'DELETE',
//   url: string,
//   options?: CustomOptions | undefined
// ) => {
//   let body: FormData | string | undefined = undefined
//   if (options?.body instanceof FormData) {
//     body = options.body
//   } else if (options?.body) {
//     body = JSON.stringify(options.body)
//   }
//   const baseHeaders: {
//     [key: string]: string
//   } =
//     body instanceof FormData
//       ? {}
//       : {
//           'Content-Type': 'application/json'
//         }
//   if (isClient) {
//     const accessToken = getAccessTokenFromLocalStorage()
//     if (accessToken) {
//       baseHeaders.Authorization = `Bearer ${accessToken}`
//     }
//   }

//   const baseUrl =
//     options?.baseUrl === undefined
//       ? configProject.NEXT_PUBLIC_API_ENDPOINT
//       : options.baseUrl

//   const fullUrl = `${baseUrl}/${normalizePath(url)}`
//   const res = await fetch(fullUrl, {
//     ...options,
//     headers: {
//       ...baseHeaders,
//       ...options?.headers
//     } as any,
//     body,
//     method
//   })
//   const payload: Response = await res.json()
//   const data = {
//     status: res.status,
//     payload
//   }

//   // Interceptor là nời chúng ta xử lý request và response trước khi trả về cho phía component
//   if (!res.ok) {
//     if (res.status === ENTITY_ERROR_STATUS) {
//       throw new EntityError(
//         data as {
//           status: 422
//           payload: EntityErrorPayload
//         }
//       )
//     } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
//       if (isClient) {
//         const locale = Cookies.get('NEXT_LOCALE')
//         if (!clientLogoutRequest) {
//           clientLogoutRequest = fetch('/api/auth/logout', {
//             method: 'POST',
//             body: null,
//             headers: {
//               ...baseHeaders
//             } as any
//           })
//           try {
//             await clientLogoutRequest
//           } catch (error) {
//           } finally {
//             removeTokensFromLocalStorage()
//             clientLogoutRequest = null
//             // Redirect về trang login có thể dẫn đến loop vô hạn
//             // Nếu không không được xử lý đúng cách
//             // Vì nếu rơi vào trường hợp tại trang Login, chúng ta có gọi các API cần access token
//             // Mà access token đã bị xóa thì nó lại nhảy vào đây, và cứ thế nó sẽ bị lặp
//             location.href = `/${locale}/login`
//           }
//         }
//       } else {
//         // Đây là trường hợp khi mà chúng ta vẫn còn access token (còn hạn)
//         // Và chúng ta gọi API ở Next.js Server (Route Handler , Server Component) đến Server Backend
//         const accessToken = (options?.headers as any)?.Authorization.split(
//           'Bearer '
//         )[1]
//         redirect(`/login?accessToken=${accessToken}`)
//       }
//     } else {
//       throw new HttpError(data)
//     }
//   }
//   // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
//   if (isClient) {
//     const normalizeUrl = normalizePath(url)
//     if (['api/auth/login', 'api/guest/auth/login'].includes(normalizeUrl)) {
//       const { accessToken, refreshToken } = (payload as LoginResType).data
//       setAccessTokenToLocalStorage(accessToken)
//       setRefreshTokenToLocalStorage(refreshToken)
//     } else if ('api/auth/token' === normalizeUrl) {
//       const { accessToken, refreshToken } = payload as {
//         accessToken: string
//         refreshToken: string
//       }
//       setAccessTokenToLocalStorage(accessToken)
//       setRefreshTokenToLocalStorage(refreshToken)
//     } else if (
//       ['api/auth/logout', 'api/guest/auth/logout'].includes(normalizeUrl)
//     ) {
//       removeTokensFromLocalStorage()
//     }
//   }
//   return data
// }

// const http = {
//   get<Response>(
//     url: string,
//     options?: Omit<CustomOptions, 'body'> | undefined
//   ) {
//     return request<Response>('GET', url, options)
//   },
//   post<Response>(
//     url: string,
//     body: any,
//     options?: Omit<CustomOptions, 'body'> | undefined
//   ) {
//     return request<Response>('POST', url, { ...options, body })
//   },
//   put<Response>(
//     url: string,
//     body: any,
//     options?: Omit<CustomOptions, 'body'> | undefined
//   ) {
//     return request<Response>('PUT', url, { ...options, body })
//   },
//   delete<Response>(
//     url: string,
//     options?: Omit<CustomOptions, 'body'> | undefined
//   ) {
//     return request<Response>('DELETE', url, { ...options })
//   }
// }

// export default http
