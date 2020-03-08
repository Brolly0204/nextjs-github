# Github OAuth

## 参考文档

https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/

## 步骤

1. Users are redirected to request their GitHub identity
2. Users are redirected back to your site by GitHub
3. Your app accesses the API with the user's access token

### 1. Request a user's GitHub identity

```
GET https://github.com/login/oauth/authorize

https://github.com/login/oauth/authorize?
  client_id=9e9d8d40160aeaae7fdc&
  scope=user,repo
```

### 2.根据code换取access token

```api
POST https://github.com/login/oauth/access_token
{
	"client_id": "9e9d8d40160aeaae7fdc",
	"client_secret": "0b034c27d02128c7fe3d7c2dae15c2681180aabf",
	"code": "ae87daa193bdb1d050cf"
}

返回access token
access_token=eb807fc0a493b9f5abea8a5fc1f32aff2a712dd9&scope=repo%2Cuser&token_type=bearer
```

### 3.使用token获取用户信息

```

GET https://api.github.com/user
request headers
Authorization: token eb807fc0a493b9f5abea8a5fc1f32aff2a712dd9
```