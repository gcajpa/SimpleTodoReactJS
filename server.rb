# This file provided by Facebook is for non-commercial testing and evaluation purposes only.
# Facebook reserves all rights not expressly granted.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
# ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

require 'webrick'
require 'json'

port = ENV['PORT'].nil? ? 3000 : ENV['PORT'].to_i

puts "Server started: http://localhost:#{port}/"

root = File.expand_path './public'
server = WEBrick::HTTPServer.new :Port => port, :DocumentRoot => root
tasks = JSON.parse(File.read('./tasks.json'))

server.mount_proc '/tasks.json' do |req, res|
  if req.request_method == 'POST'
    # Assume it's well formed
    tasks << req.query
    File.write('./tasks.json', JSON.pretty_generate(tasks, :indent => '    '))
  end

  # always return json
  res['Content-Type'] = 'application/json'
  res['Cache-Control'] = 'no-cache'
  res.body = JSON.generate(tasks)
end

server.mount_proc '/tasks.json/edit' do |req, res|
  if req.query["status"] == "true"
    tasks[req.query["task"].to_i]["status"] = true
  elsif
    tasks[req.query["task"].to_i]["status"] = false
  end

  File.write('./tasks.json', JSON.pretty_generate(tasks, :indent => '    '))

  # always return json
  res['Content-Type'] = 'application/json'
  res['Cache-Control'] = 'no-cache'
  res.body = JSON.generate(tasks[req.query["task"].to_i])
end

trap 'INT' do server.shutdown end

server.start
