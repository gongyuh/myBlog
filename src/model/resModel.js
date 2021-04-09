class BaseModel{
    //我们需要的是第一个传入对象类型，第二个传入字符串类型
    constructor(data,message){
        if(typeof data === 'string'){
            this.message = data;
            data = null;
            message = null;
        }
        if(data){
            this.data = data;
        }
        if(message){
            this.message = message;
        }
    }
}

class SuccessModel extends BaseModel{
    constructor(data,message){
        super(data,message)
        this.errno = 0
    }
}

class ErrorModel extends BaseModel{
    constructor(data,message){
        super(data,message)
        this.errno = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
  }