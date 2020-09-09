<template>
    <div class="login">
        <div class="system-title">
            <div class="logo"></div>
            <div class="title">融合语音视频通话</div>
        </div>
        <div class="login-form">
            <div class="login-form-box">
                <h2>用户登录</h2>
                <el-input
                    class="el-input"
                    @focus="warningMsg = ''"
                    placeholder="请输入您的账号"
                    v-model.trim="loginForm.account">
                    <i slot="prefix" class="el-input__icon el-icon-user"></i>
                </el-input>
                <el-input
                    class="el-input"
                    type="password"
                    @focus="warningMsg = ''"
                    placeholder="请输入您的密码"
                    v-model.trim="loginForm.password">
                    <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                </el-input>
                <div class="warn-message">{{warningMsg}}</div>
                <el-button type="primary" class="el-button" :disabled="buttonStatus" @click="handleLogin">登录</el-button>
<!--                <div class="form-foot">欢迎使用三景权限管理平台</div>-->
            </div>
        </div>
        <div class="login-form-bg"></div>
        <footer>Copyright © 2020-2030 All Rights Reserved 佳都新太科技股份有限公司版权所有 v1.0.0</footer>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex';

    export default {
        name: 'login',
        computed: {
            buttonStatus () {
                return this.loginForm.account === '' || this.loginForm.password === '';
            }
        },
        data () {
            return {
                warningMsg: '',
                loginForm: {
                    account: '',
                    from: 'web-apidoc',
                    loginType: '1',
                    outerId: '',
                    password: '',
                    verificationCode: ''
                },

            };
        },
        methods: {
            ...mapMutations('user',
                ['SET_USERINFO']
            ),
            handleLogin () {
                if (this.loginForm.account && this.loginForm.password) {
                    this.$api.loginApi.login(this.loginForm).then((res => {
                        if (res.data) {
                            this.$utils.setToken(res.data.token);
                            this.SET_USERINFO(res.data.user);
                            sessionStorage.setItem('authUser', JSON.stringify(res.data.user));
                            const loading = this.$loading({
                                lock: true,
                                text: '数据初始化...',
                            });
                            setTimeout(() => {
                                loading.close();
                                this.$router.push({ path: '/' });
                            }, 1500);
                        } else {
                            this.warningMsg = res.message;
                        }
                    }));
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .login {
        width: 100%;
        height: 100%;
        position: relative;
        background-image: url("../../../assets/login/login-bg.jpg");

        .system-title {
            width: 30%;
            height: 4%;
            left: 11%;
            top: 10%;
            display: flex;
            position: absolute;

            .logo {
                width: 12%;
                background-size: 100% 100%;
                background-image: url("../../../assets/login/logo.png");
            }

            .title {
                color: white;
                font-size: 32px;
                margin: 1% 0 0 3%;
            }
        }

        .login-form {
            width: 16%;
            height: 44%;
            min-width: 16%;
            min-height: 44%;
            float: left;
            left: 12%;
            top: 20%;
            z-index: 5;
            padding: 8px;
            position: relative;
            border-radius: 8px;

            &-box {
                width: 100%;
                height: 100%;
                text-align: center;
                background: white;
                border-radius: 8px;
                padding: 15% 10%;
                position: relative;

                .el-input {
                    margin-top: 15%;
                }

                .el-input__icon {
                    color: #77eeff;
                    font-size: 20px;
                }

                .el-button {
                    width: 100%;
                    background: #3485FB;
                    border: none;
                }

                .warn-message {
                    color: red;
                    text-align: left;
                    height: 15%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .form-foot {
                    text-align: center;
                    opacity: 0.5;
                    position: absolute;
                    bottom: 0;
                    width: 83%;
                    margin: 0 auto;
                }
            }
        }

        .login-form-bg {
            width: 16%;
            height: 44%;
            min-width: 8%;
            min-height: 22%;
            position: absolute;
            background: #fff;
            opacity: 0.3;
            z-index: 0;
            left: 12%;
            top: 20%;
            border-radius: 8px;
        }

        footer {
            position: absolute;
            bottom: 0;
            left: 35%;
            color: white;
        }
    }
</style>
