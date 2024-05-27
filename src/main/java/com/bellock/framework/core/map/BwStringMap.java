package com.bellock.framework.core.map;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;


/**
 * Map<String, String>을 StringMap으로 타입 정의한 클래스.
 * Map<K, V>은 인터페이스이기 때문에 간단히 타입정의할 수 없으며 클래스로 타입 정의
 * 내부 메서드를 모두 구현해야하며,내부 맵 객체를 통해 각 메서드를 정의한다.
 * 
 * @history: 2024.05, 나인석, 최초작성
 */
public class BwStringMap implements Map<String, String> {
    /**
     * 내부 맵 객체, 실제 데이터를 저장 관리.
     */
    private Map<String, String> internalMap = new HashMap<>();


    /**
     * 이 맵에 저장된 키-값 매핑의 수를 반환. 만약 맵이 {@code Integer.MAX_VALUE} 
     * 보다 많은 요소를 포함하고 있다면, {@code Integer.MAX_VALUE}를 반환.
     *
     * @return the number of key-value mappings in this map
     */
    @Override
    public int size() {
        return internalMap.size();
    }

    /**
     * 맵에 저장된 키-값 매핑이 없으면 {@code true}를 반환.
     *
     * @return {@code true} if this map contains no key-value mappings
     */
    @Override
    public boolean isEmpty() {
        return internalMap.isEmpty();
    }

    /**
     * 맵이 지정된 키에 대한 매핑을 포함하고 있는 경우 {@code true}를 반환.
     * More formally, returns {@code true} if and only if this map contains 
     * a mapping for a key such that {@code Objects.equals(key, k)}. 
     *
     * @param key key whose presence in this map is to be tested
     * @return {@code true} if this map contains a mapping for the specified key
     */
    @Override
    public boolean containsKey(Object key) {
        return internalMap.containsKey(key);
    }

    /**
     * 맵이 하나 이상의 키가 지정된 값과 매핑하는 경우 {@code true}를 반환.
     * More formally, returns {@code true} if and only if
     * this map contains at least one mapping to a value {@code v} such that
     * {@code Objects.equals(value, v)}.  This operation
     * will probably require time linear in the map size for most
     * implementations of the {@code Map} interface.
     *
     * @param value value whose presence in this map is to be tested
     * @return {@code true} if this map maps one or more keys to the
     *         specified value
     */
    @Override
    public boolean containsValue(Object value) {
        return internalMap.containsValue(value);
    }

    /**
     * 지정된 키와 매핑된 값 또는 매핑된 값이 없으면 {@code null}을 반환.
     *
     * <p>More formally, if this map contains a mapping from a key
     * {@code k} to a value {@code v} such that
     * {@code Objects.equals(key, k)},
     * then this method returns {@code v}; otherwise
     * it returns {@code null}.  (There can be at most one such mapping.)
     *
     * <p>If this map permits null values, then a return value of
     * {@code null} does not <i>necessarily</i> indicate that the map
     * contains no mapping for the key; it's also possible that the map
     * explicitly maps the key to {@code null}.  The {@link #containsKey
     * containsKey} operation may be used to distinguish these two cases.
     *
     * @param key the key whose associated value is to be returned
     * @return the value to which the specified key is mapped, or
     *         {@code null} if this map contains no mapping for the key
     */
    @Override
    public String get(Object key) {
        return internalMap.get(key);
    }

    /**
     * 맵에 지정한 키와 지정한 값을 매핑시킵니다 (선택적인 동작).  
     * If the map previously contained a mapping for
     * the key, the old value is replaced by the specified value.  (A map
     * {@code m} is said to contain a mapping for a key {@code k} if and only
     * if {@link #containsKey(Object) m.containsKey(k)} would return
     * {@code true}.)
     *
     * @param key key with which the specified value is to be associated
     * @param value value to be associated with the specified key
     * @return the previous value associated with {@code key}, or
     *         {@code null} if there was no mapping for {@code key}.
     *         (A {@code null} return can also indicate that the map
     *         previously associated {@code null} with {@code key},
     *         if the implementation supports {@code null} values.)
     */
    @Override
    public String put(String key, String value) {
        return internalMap.put(key, value);
    }

    /**
     * 맵에서 키에 대한 매핑을 제거 (선택적인 동작).   
     * More formally, if this map contains a mapping
     * from key {@code k} to value {@code v} such that
     * {@code Objects.equals(key, k)}, that mapping
     * is removed.  (The map can contain at most one such mapping.)
     *
     * 맵에 키에 대한 매핑이 존재한다면, 키에 매핑된 값을 반환하고 만약 
     * 맵이 키에 대한 매핑이 존재하지 한으면 {@code null}을 반환.
     *
     * <p>If this map permits null values, then a return value of
     * {@code null} does not <i>necessarily</i> indicate that the map
     * contained no mapping for the key; it's also possible that the map
     * explicitly mapped the key to {@code null}.
     *
     * <p>The map will not contain a mapping for the specified key once the
     * call returns.
     *
     * @param key key whose mapping is to be removed from the map
     * @return the previous value associated with {@code key}, or
     *         {@code null} if there was no mapping for {@code key}.
     */
    @Override
    public String remove(Object key) {
        return internalMap.remove(key);
    }

    /**
     * 파라메터 맵의 모든 매핑을 해당 맵으로 복사한다 (선택적인 동작).  
     * The effect of this call is equivalent to that
     * of calling {@link #put(Object,Object) put(k, v)} on this map once
     * for each mapping from key {@code k} to value {@code v} in the
     * specified map.  The behavior of this operation is undefined if the specified map
     * is modified while the operation is in progress. If the specified map has a defined
     * <a href="SequencedCollection.html#encounter">encounter order</a>,
     * processing of its mappings generally occurs in that order.
     *
     * @param m mappings to be stored in this map
     */
    @Override
    public void putAll(Map<? extends String, ? extends String> m) {
        internalMap.putAll(m);
    }

    /**
     * 모든 매핑을 제거한다 (선택적인 동작).
     * The map will be empty after this call returns.
     *
     * @throws UnsupportedOperationException if the {@code clear} operation
     *         is not supported by this map
     */
    @Override
    public void clear() {
        internalMap.clear();
    }

    /**
     * 맵에 포함된 모든 키들의 {@link Set} 뷰를 반환한다.
     * The set is backed by the map, so changes to the map are
     * reflected in the set, and vice-versa.  If the map is modified
     * while an iteration over the set is in progress (except through
     * the iterator's own {@code remove} operation), the results of
     * the iteration are undefined.  The set supports element removal,
     * which removes the corresponding mapping from the map, via the
     * {@code Iterator.remove}, {@code Set.remove},
     * {@code removeAll}, {@code retainAll}, and {@code clear}
     * operations.  It does not support the {@code add} or {@code addAll}
     * operations.
     *
     * @return a set view of the keys contained in this map
     */
    @Override
    public Set<String> keySet() {
        return internalMap.keySet();
    }

    /**
     * 맵에 포함된 모든 값들의 {@link Collection} 뷰를 반환한다.
     * The collection is backed by the map, so changes to the map are
     * reflected in the collection, and vice-versa.  If the map is
     * modified while an iteration over the collection is in progress
     * (except through the iterator's own {@code remove} operation),
     * the results of the iteration are undefined.  The collection
     * supports element removal, which removes the corresponding
     * mapping from the map, via the {@code Iterator.remove},
     * {@code Collection.remove}, {@code removeAll},
     * {@code retainAll} and {@code clear} operations.  It does not
     * support the {@code add} or {@code addAll} operations.
     *
     * @return a collection view of the values contained in this map
     */
    @Override
    public Collection<String> values() {
        return internalMap.values();
    }

    /**
     * 맵에 포함된 모든 매핑들의 {@link Set} 뷰를 반환한다.
     * The set is backed by the map, so changes to the map are
     * reflected in the set, and vice-versa.  If the map is modified
     * while an iteration over the set is in progress (except through
     * the iterator's own {@code remove} operation, or through the
     * {@code setValue} operation on a map entry returned by the
     * iterator) the results of the iteration are undefined.  The set
     * supports element removal, which removes the corresponding
     * mapping from the map, via the {@code Iterator.remove},
     * {@code Set.remove}, {@code removeAll}, {@code retainAll} and
     * {@code clear} operations.  It does not support the
     * {@code add} or {@code addAll} operations.
     *
     * @return a set view of the mappings contained in this map
     */
    @Override
    public Set<Entry<String, String>> entrySet() {
        return internalMap.entrySet();
    }

}


