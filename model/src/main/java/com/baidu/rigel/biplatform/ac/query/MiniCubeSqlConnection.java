/**
 * Copyright (c) 2014 Baidu, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.baidu.rigel.biplatform.ac.query;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.baidu.rigel.biplatform.ac.exception.MiniCubeQueryException;
import com.baidu.rigel.biplatform.ac.query.data.DataModel;
import com.baidu.rigel.biplatform.ac.query.data.impl.SqlDataSourceInfo;
import com.baidu.rigel.biplatform.ac.query.model.ConfigQuestionModel;
import com.baidu.rigel.biplatform.ac.query.model.QuestionModel;
import com.baidu.rigel.biplatform.ac.util.AnswerCoreConstant;
import com.baidu.rigel.biplatform.ac.util.ConfigInfoUtils;
import com.baidu.rigel.biplatform.ac.util.DesCoderUtil;
import com.baidu.rigel.biplatform.ac.util.HttpRequest;
import com.baidu.rigel.biplatform.ac.util.JsonUnSeriallizableUtils;
import com.baidu.rigel.biplatform.ac.util.ResponseResult;

/**
 * minicube sql 连接
 * 
 * @author xiaoming.chen
 *
 */
public class MiniCubeSqlConnection implements MiniCubeConnection {
    
    private Logger log = LoggerFactory.getLogger(this.getClass());
    /**
     * sqlDataSourceInfo
     */
    private SqlDataSourceInfo sqlDataSourceInfo;
    
    /**
     * construct with
     * 
     * @param cube
     *            cube对象
     * @param dataSourceInfo
     *            数据源信息
     */
    protected MiniCubeSqlConnection(SqlDataSourceInfo dataSourceInfo) {
        this.sqlDataSourceInfo = dataSourceInfo;
    }
    
    @Override
    public DataModel query(QuestionModel questionModel) throws MiniCubeQueryException {
        long current = System.currentTimeMillis();
        Map<String, String> params = new HashMap<String, String>();
        long curr = System.currentTimeMillis();
        String response = null;
        String questionModelJson = null;
        if (ConfigInfoUtils.getServerAddressByProperty("server.queryrouter.address") != null) {
            String systemCode = "designer";
            ConfigQuestionModel configQuestionModel = (ConfigQuestionModel) questionModel;
            questionModelJson = AnswerCoreConstant.GSON.toJson(questionModel);
            log.info("begin execute query with queryrouter ");
//            log.info(questionModelJson);
            log.debug("---------------------------------------------------------------------");
            String temp = new String(questionModelJson);
            temp = DesCoderUtil.encrypt(questionModelJson, systemCode);
            log.debug(temp);
            questionModelJson = temp;
            log.debug(DesCoderUtil.decrypt(temp));
            log.debug("---------------------------------------------------------------------");
            params.put(QUESTIONMODEL_PARAM_KEY, questionModelJson);
            params.put("token",
                    DesCoderUtil.encrypt(configQuestionModel.getDataSourceInfo().getProductLine()));
            response = HttpRequest.sendPost(
                    ConfigInfoUtils.getServerAddressByProperty("server.queryrouter.address")
                            + "/queryrouter/query", params);
        } else {
            questionModelJson = AnswerCoreConstant.GSON.toJson(questionModel);
            log.info("begin execute query with tesseract ");
            params.put(QUESTIONMODEL_PARAM_KEY, questionModelJson);
            response = HttpRequest.sendPost(ConfigInfoUtils.getServerAddress() + "/query", params);
        }
        
        log.info("execute query with tesseract/queryrouter cost {} ms",
                (System.currentTimeMillis() - curr));
        ResponseResult responseResult = AnswerCoreConstant.GSON.fromJson(response,
                ResponseResult.class);
        if (StringUtils.isNotBlank(responseResult.getData())) {
            String dataModelJson = responseResult.getData().replace("\\", "");
            dataModelJson = dataModelJson.substring(1, dataModelJson.length() - 1);
            DataModel dataModel = JsonUnSeriallizableUtils.dataModelFromJson(dataModelJson);
            StringBuilder sb = new StringBuilder();
            // sb.append("execute query questionModel:").append(questionModel).append(" cost:")
            sb.append("execute query questionModel cost:")
                    .append(System.currentTimeMillis() - current).append("ms");
            log.info(sb.toString());
            dataModel.setOthers(responseResult.getStatusInfo());
            return dataModel;
        }
        throw new MiniCubeQueryException("query occur error,msg:" + responseResult.getStatusInfo());
    }
    
    /**
     * getter method for property sqlDataSourceInfo
     * 
     * @return the sqlDataSourceInfo
     */
    public SqlDataSourceInfo getSqlDataSourceInfo() {
        return sqlDataSourceInfo;
    }
    
    @Override
    public void close() {
        // 发起远程清理cube池子的请求 close的话，close当前connection的cube
        throw new UnsupportedOperationException("not implement yet.");
    }
    
}
