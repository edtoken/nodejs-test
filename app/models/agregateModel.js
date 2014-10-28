'use strict';
var _ = require('underscore');
var http;
http = require('http');

/**
 *
 * @param data query get parameters
 * @constructor
 */
var AgregateModel = function (data) {

    this.data = data;
    this.options = {
        order_by: 'count',
        order_dir: true,
        separator: ",",
        fields: [],
        fieldsDefault: ["gilded", "num_comments", "ups", "downs", "score"]
    };

    if (this.data.order_by && this.options.fieldsDefault.indexOf(this.data.order_by) >= 0) {
        this.options.order_by = this.data.order_by;
    }

    this.options.order_dir = (this.data.order_dir === "0") ? false : true;

    this.options.fields = _.filter(this.data.show, function (name) {
        return this.options.fieldsDefault.indexOf(name) >= 0;
    }, this);
};

/**
 * create error object
 * @param msg string, error message
 * @returns {{error: number, message: *, data: boolean}}
 * @private
 */
AgregateModel.prototype._getErrorObj = function (msg) {
    return {error: 1, message: msg, data: false};
};

/**
 * agregate one item in parse request
 * @param oldObj current item
 * @param newData
 * @returns {{}}
 * @private
 */
AgregateModel.prototype._agregateItemData = function (oldObj, newData) {

    var obj = {};
    if (_.isObject(oldObj)) {
        obj = oldObj;
    }

    obj.domain = newData.domain;
    obj.count = (obj.count) ? obj.count + 1 : 1;

    _.each(this.options.fieldsDefault, function (name) {
        if (this.options.fields.indexOf(name) >= 0) {
            if (_.has(obj, name)) {
                obj[name] += parseInt(newData[name])
            } else {
                obj[name] = parseInt(newData[name]);
            }
        }
    }, this);

    return obj;
};

/**
 * parse json data
 * @param obj json object
 * @returns {*}
 * @private
 */

AgregateModel.prototype._parseRequest = function (obj) {

    if (!_.has(obj, "data") || !_.has(obj.data, "children")) {
        return this._getErrorObj("invalid json data");
    }

    var responseOut;
    var response = {};
    var items = obj.data.children;

    _.each(items, function (item) {
        if (item.data && item.data.domain) {
            response[item.data.domain] = this._agregateItemData(response[item.data.domain], item.data);
        }
    }, this);

    responseOut = _.sortBy(response, function (item) {
        if (item[this.options.order_by]) {
            return item[this.options.order_by];
        }
    }, this);

    if (!this.options.order_dir) {
        responseOut.reverse();
    }

    return responseOut;
};

/**
 * get data from url
 * @param callback
 * @param context
 * @private
 */
AgregateModel.prototype._getRequest = function (callback, context) {

    var self = context || this;

    http.get(this.data.url, function (r) {

        var str = '';

        r.on("data", function (chunk) {
            str += chunk;
        });

        r.on("end", function () {
            callback.call(self, str);
        });

    }).on("error", function () {
        callback.call(self, self._getErrorObj("request error"));
    });
};

/**
 * create csv string from obj
 * @param obj result from parseRequest function
 * @returns {string}
 * @private
 */
AgregateModel.prototype._createCSVResponse = function (obj) {

    var separator = this.data.separator || this.options.separator;
    var responseCSV = "";

    _.each(obj, function (val, domain) {
        responseCSV += _.values(val).join(separator);
        responseCSV += "\r\n";
    });

    return responseCSV;

};

/**
 * use model data and generate csv string
 * @param callback
 * @returns {*}
 */
AgregateModel.prototype.getCSVSTR = function (callback) {

    if (!this.data.url) {
        return callback(this._getErrorObj("please insert url"));
    }

    this._getRequest(function (resp) {

        try {

            var jsonData = JSON.parse(resp);
            var agregateData = this._parseRequest(jsonData);
            var CSV = this._createCSVResponse(agregateData);
            callback({data: CSV, error: false, message: "csv response"});

        } catch (e) {
            return callback(this._getErrorObj("error parsing json"));
        }

    }, this);

    return this;
};

module.exports = AgregateModel;